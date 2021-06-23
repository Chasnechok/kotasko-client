const formatReqCookies = (req): string => {
    if (!req.cookies) return ''
    let cookies = ''
    for (const cookieName in req.cookies) {
        cookies += cookieName + '=' + req.cookies[cookieName] + '; '
    }
    return cookies
}

export default formatReqCookies
