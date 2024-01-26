// 清空指定名称的Cookie
function clearCookie(cookieName) {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// 调用函数清空名为"exampleCookie"的Cookie
// clearCookie("exampleCookie");

export default clearCookie;
