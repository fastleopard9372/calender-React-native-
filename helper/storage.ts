
export const eraseStorage = () => {
    localStorage.setItem('user', null);
    localStorage.setItem('token', null);
}