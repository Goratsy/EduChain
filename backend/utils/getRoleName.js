export function getRoleName(roleCode) {
    const roles = {
        '0': 'None',
        '1': 'Admin',
        '2': 'University',
        '3': 'Student',
        0n: 'None',
        1n: 'Admin',
        2n: 'University',
        3n: 'Student'
    };
    return roles[roleCode] || 'Unknown';
}