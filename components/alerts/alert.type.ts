export default interface IAlert {
    content: string
    closeAfterMS: number
    theme: 'success' | 'danger' | 'info'
}
