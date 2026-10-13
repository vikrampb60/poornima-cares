// Simple admin credentials (can later be replaced with backend API)

const adminData = {
  username: "admin",
  password: "admin123"
};

// Function to validate login
export const validateAdmin = (username, password) => {
  return (
    username === adminData.username &&
    password === adminData.password
  );
};

export default adminData;