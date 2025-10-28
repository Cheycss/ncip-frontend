// Generate unique avatar colors based on user name
export const generateAvatarColor = (name) => {
  if (!name) return { bg: 'from-blue-400 to-blue-500', text: 'text-white' };
  
  // Hash the name to get a consistent color
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Define color palettes
  const colorPalettes = [
    { bg: 'from-blue-400 to-blue-600', text: 'text-white' },
    { bg: 'from-indigo-400 to-indigo-600', text: 'text-white' },
    { bg: 'from-purple-400 to-purple-600', text: 'text-white' },
    { bg: 'from-pink-400 to-pink-600', text: 'text-white' },
    { bg: 'from-red-400 to-red-600', text: 'text-white' },
    { bg: 'from-orange-400 to-orange-600', text: 'text-white' },
    { bg: 'from-yellow-400 to-yellow-600', text: 'text-gray-900' },
    { bg: 'from-green-400 to-green-600', text: 'text-white' },
    { bg: 'from-teal-400 to-teal-600', text: 'text-white' },
    { bg: 'from-cyan-400 to-cyan-600', text: 'text-white' },
    { bg: 'from-sky-400 to-sky-600', text: 'text-white' },
    { bg: 'from-violet-400 to-violet-600', text: 'text-white' },
    { bg: 'from-fuchsia-400 to-fuchsia-600', text: 'text-white' },
    { bg: 'from-rose-400 to-rose-600', text: 'text-white' },
    { bg: 'from-emerald-400 to-emerald-600', text: 'text-white' },
    { bg: 'from-lime-400 to-lime-600', text: 'text-gray-900' },
  ];
  
  const index = Math.abs(hash) % colorPalettes.length;
  return colorPalettes[index];
};

// Get user initials
export const getUserInitials = (firstName, lastName) => {
  const first = firstName?.[0]?.toUpperCase() || '';
  const last = lastName?.[0]?.toUpperCase() || '';
  return first + last || 'U';
};

// Generate avatar component props
export const getAvatarProps = (user) => {
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  const initials = getUserInitials(user?.firstName, user?.lastName);
  const colors = generateAvatarColor(fullName);
  
  return {
    initials,
    colors,
    fullName
  };
};
