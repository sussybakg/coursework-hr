export const isAdmin = (user) => {
    return (user?.role || '').toLowerCase() === 'admin';
};


