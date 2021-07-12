import $api from '../../http'
import formatReqCookies from '../../http/cookie'
import IUser, { UserRoleTypes } from '../../models/user'
import Layout from '../../components/_layout'
import { Fragment, useState } from 'react'
import Head from 'next/head'
import Lsi from '../../lsi/admin/index.lsi'
import Column from '../../components/adminPage/column'
import OrgCreateForm from '../../components/adminPage/organisation/org-create-form'
import { useAppUsers, useDepList, useOrgList } from '../../hooks/useFetchCollection'
import OrgComponent from '../../components/adminPage/organisation/org-component'
import DepCreateForm from '../../components/adminPage/department/dep-create-form'
import DepComponent from '../../components/adminPage/department/dep-component'
import UserComponent from '../../components/adminPage/user/user-component'
import UserCreateForm from '../../components/adminPage/user/user-create-form'
import UserEditForm from '../../components/adminPage/user/user-edit-form'
import axios from 'axios'

interface AdminPageProps {
    userFromSession: IUser
}

const AdminPage: React.FC<AdminPageProps> = ({ userFromSession }) => {
    const [orgFormOpened, setOrgFormOpened] = useState(false)
    const [depFormOpened, setDepFormOpened] = useState(false)
    const [usersFormOpened, setUsersFormOpened] = useState(false)
    const [userEditFromOpened, setUserEditFromOpened] = useState(false)
    const [editingUser, setEditingUser] = useState<IUser>(null)
    const { loading: orgsLoading, data: orgs, mutate: updateOrgList } = useOrgList()
    const { loading: depsLoading, data: deps, mutate: updateDepList } = useDepList()
    const { loading: usersLoading, data: appUsers } = useAppUsers()

    function openEditForm(target: IUser) {
        setUserEditFromOpened(true)
        setEditingUser(target)
    }

    return (
        <Layout userFromSession={userFromSession}>
            {(language, user) => (
                <Fragment>
                    <Head>
                        <title>Kotasko | {Lsi.pageName[language]}</title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <section className="flex flex-wrap h-full justify-center">
                        <OrgCreateForm
                            updateOrgList={updateOrgList}
                            formOpened={orgFormOpened}
                            setFormOpened={setOrgFormOpened}
                        />
                        <Column loading={orgsLoading} name="Структуры" setFormOpened={setOrgFormOpened}>
                            {orgs && orgs.map((org) => <OrgComponent key={org._id} organisation={org} />)}
                        </Column>

                        {orgs && (
                            <DepCreateForm
                                formOpened={depFormOpened}
                                updateDepList={updateDepList}
                                setFormOpened={setDepFormOpened}
                                organisations={orgs}
                            />
                        )}

                        <Column loading={depsLoading} name="Подразделения" setFormOpened={setDepFormOpened}>
                            {deps && deps.map((dep) => <DepComponent key={dep._id} department={dep} />)}
                        </Column>

                        <UserCreateForm formOpened={usersFormOpened} setFormOpened={setUsersFormOpened} />
                        <UserEditForm
                            formOpened={userEditFromOpened}
                            setFormOpened={setUserEditFromOpened}
                            user={editingUser}
                            adminUser={user}
                        />
                        <Column loading={usersLoading} name="Пользователи" setFormOpened={setUsersFormOpened}>
                            {appUsers &&
                                appUsers.map((u) => (
                                    <UserComponent onClick={() => openEditForm(u)} key={u._id} user={u} />
                                ))}
                        </Column>
                    </section>
                </Fragment>
            )}
        </Layout>
    )
}

export async function getServerSideProps({ req }) {
    try {
        const user = await axios.get<IUser>('http://localhost:5000/auth/checkSession', {
            headers: {
                Cookie: formatReqCookies(req),
            },
        })
        if (!user.data.roles.includes(UserRoleTypes.ADMIN)) throw new Error()

        return {
            props: {
                userFromSession: user.data,
            },
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

export default AdminPage
