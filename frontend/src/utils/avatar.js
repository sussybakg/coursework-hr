export const getAvatarUrl = (avatarURL) => {
    if (!avatarURL) return null;
    
    if (avatarURL.startsWith("http://") || avatarURL.startsWith("https://")) {
        return avatarURL;
    }
    
    if (avatarURL.startsWith("/uploads/")) {
        return `http://localhost:8080${avatarURL}`;
    }
    
    return avatarURL;
};

