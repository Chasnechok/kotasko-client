import { ReactChild, PropsWithChildren, useRef, useEffect, useCallback, FC, Children, MutableRefObject } from 'react'
import { PuffLoader } from 'react-spinners'
import { useSWRInfinite } from 'swr'
import EmptyIcon from '../../public/icons/empty.svg'
import Image from 'next/image'

type Renderable = ReactChild | Renderable[]

interface InfiniteListProps<T> {
    fetchUrl: string
    pageSize: number
    emptyMessage?: string
    rootRef?: MutableRefObject<undefined>
    shouldRender: (T) => boolean
    children: (item: T, mutate: () => void, isValidating: boolean) => Renderable
}

const getKey = (pageIndex, previousPageData, url, pageSize) => {
    // reached the end
    if (previousPageData && !previousPageData.data) return null

    // first page
    if (pageIndex === 0) return `${url}?limit=${pageSize}`

    return `${url}?cursor=${previousPageData.nextCursor}&limit=${pageSize}`
}

export interface SWResponse<T> {
    data: Array<T>
    nextCursor: string
}

type EntityId<T> = T & { _id: string }

function InfiniteList<Entity extends FC<InfiniteListProps<Entity>>>({
    children,
    fetchUrl,
    pageSize,
    shouldRender,
    emptyMessage,
    rootRef,
}: PropsWithChildren<InfiniteListProps<Entity>>) {
    const { data, size, setSize, error, isValidating, mutate } = useSWRInfinite<SWResponse<EntityId<Entity>>>(
        (...args) => getKey(...args, fetchUrl, pageSize)
    )
    const isLoadingInitialData = !data && !error
    const hasMore = data && data[data.length - 1]?.data?.length == pageSize
    const isLoading = isLoadingInitialData || (size > 0 && data && !data[size - 1])
    const observer = useRef<IntersectionObserver>()
    const lastElementRef = useCallback(
        (node: HTMLLIElement) => {
            if (isLoading) return
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && hasMore) setSize((prev) => prev + 1)
                },
                {
                    root: rootRef ? rootRef.current : null,
                }
            )
            if (node) observer.current.observe(node)
        },
        [hasMore, isLoading]
    )

    useEffect(() => {
        if (observer.current) observer.current.disconnect()
    }, [])

    function isEmpty() {
        return !data || !data.some((cluster) => cluster.data && cluster.data.some((item) => shouldRender(item)))
    }

    return (
        <div className="overflow-y-auto h-full relative">
            {isEmpty() && !isLoading && (
                <div className="flex flex-col select-none align-middle mt-10 opacity-50">
                    <h1 className="text-center ">{emptyMessage || 'Здесь пусто'}</h1>
                    <Image className="pointer-events-none" src={EmptyIcon} />
                </div>
            )}
            <ul className="lg:mr-2">
                {data &&
                    data.map((res) => {
                        if (!res || !res.data) return children(null, mutate, isValidating)
                        const items = res.data.filter((entity) => shouldRender(entity))
                        // children should always receive mutate function
                        if (!items || !items.length) return children(null, mutate, isValidating)
                        return items.map((entity, i) => {
                            return i == items.length - 1 ? (
                                <li ref={lastElementRef} key={entity._id}>
                                    {children(entity, mutate, isValidating)}
                                </li>
                            ) : (
                                <li key={entity._id}>{children(entity, mutate, isValidating)}</li>
                            )
                        })
                    })}
                {isLoading && <PuffLoader css="display: block; margin: 0 auto;" color="rgba(59, 130, 246)" />}
            </ul>
        </div>
    )
}

export default InfiniteList
