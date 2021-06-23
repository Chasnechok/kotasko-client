import Head from 'next/head'
import React, { Fragment } from 'react'
import $api from '../../http'
import formatReqCookies from '../../http/cookie'
import Layout from '../_layout'

export interface TasksPageProps {}

const TasksPage: React.FC<TasksPageProps> = () => {
    return (
        <Layout>
            {(language) => (
                <Fragment>
                    <Head>
                        <title>Tasks</title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    Tasks page
                    <p>{language}</p>
                </Fragment>
            )}
        </Layout>
    )
}

export async function getServerSideProps({ req }) {
    try {
        await $api.get('/auth/checkSession', {
            headers: {
                Cookie: formatReqCookies(req),
            },
        })
        return {
            props: {},
        }
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
}

export default TasksPage
