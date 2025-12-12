import { FiSearch, FiFilter, FiPlus, FiChevronDown, FiUsers } from 'react-icons/fi';
import { useEffect, useState } from "react";
import { getUsersByRole } from "../../network/api";
import UserCard from "../../components/FormComponent/UserCard";
import PageAnimate from "../../components/Animate/PageAnimate";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from './ViewUser.module.css';

const ViewUsers = () => {
    const roles = ["admin", "manager", "operator", "customer"];
    const [users, setUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState(roles[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("name");
    const [loading, setLoading] = useState(true);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showRoleMenu, setShowRoleMenu] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await getUsersByRole(selectedRole);
                if (response.status === 200) {
                    setUsers(response.data);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [selectedRole]);

    const capitalize = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const navigate = useNavigate();

    const addUser = () => {
        if (selectedRole === 'customer') {
            navigate('/customers/add');
        } else {
            navigate('/users/add');
        }
    };

    const filteredUsers = users.filter(user =>
        (user.first_name + ' ' + user.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const sortedUsers = filteredUsers.sort((a, b) => {
        if (sortOption === "name") {
            const nameA = `${a.first_name} ${a.last_name}`;
            const nameB = `${b.first_name} ${b.last_name}`;
            return nameA.localeCompare(nameB);
        } else if (sortOption === "email") {
            return a.email.localeCompare(b.email);
        }
        return 0;
    });

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            }
        }
    };

    return (
        <PageAnimate>
            <div className={styles.container}>
                {/* Header Section */}
                <motion.div 
                    className={styles.header}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className={styles.headerContent}>
                        <div className={styles.titleSection}>
                            <div className={styles.iconWrapper}>
                                <FiUsers className={styles.headerIcon} />
                            </div>
                            <div>
                                <h1 className={styles.pageTitle}>Team Members</h1>
                                <p className={styles.pageSubtitle}>Manage and view all users in your organization</p>
                            </div>
                        </div>
                        <motion.button 
                            className={styles.addButton}
                            onClick={addUser}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiPlus />
                            <span>Add New User</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Controls Section */}
                <motion.div 
                    className={styles.controlsSection}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div className={styles.controlsGrid}>
                        {/* Role Selector */}
                        <div className={styles.selectorWrapper}>
                            <label className={styles.label}>Role</label>
                            <div className={styles.dropdown}>
                                <button 
                                    className={styles.dropdownButton}
                                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                                >
                                    <span>{capitalize(selectedRole)}</span>
                                    <FiChevronDown className={showRoleMenu ? styles.chevronActive : ''} />
                                </button>
                                <AnimatePresence>
                                    {showRoleMenu && (
                                        <motion.div 
                                            className={styles.dropdownMenu}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {roles.map((role) => (
                                                <motion.button
                                                    key={role}
                                                    className={`${styles.dropdownItem} ${selectedRole === role ? styles.active : ''}`}
                                                    onClick={() => {
                                                        setSelectedRole(role);
                                                        setShowRoleMenu(false);
                                                    }}
                                                    whileHover={{ backgroundColor: 'rgba(196, 32, 50, 0.1)' }}
                                                >
                                                    {capitalize(role)}
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Search Box */}
                        <div className={styles.searchWrapper}>
                            <label className={styles.label}>Search</label>
                            <div className={styles.searchInputGroup}>
                                <FiSearch className={styles.searchIcon} />
                                <input
                                    className={styles.searchInput}
                                    type="text"
                                    placeholder="Search by name, email or username..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Sort Selector */}
                        <div className={styles.selectorWrapper}>
                            <label className={styles.label}>Sort By</label>
                            <div className={styles.dropdown}>
                                <button 
                                    className={styles.dropdownButton}
                                    onClick={() => setShowSortMenu(!showSortMenu)}
                                >
                                    <span>{sortOption === 'name' ? 'Name' : 'Email'}</span>
                                    <FiFilter />
                                </button>
                                <AnimatePresence>
                                    {showSortMenu && (
                                        <motion.div 
                                            className={styles.dropdownMenu}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <motion.button
                                                className={`${styles.dropdownItem} ${sortOption === 'name' ? styles.active : ''}`}
                                                onClick={() => {
                                                    setSortOption('name');
                                                    setShowSortMenu(false);
                                                }}
                                                whileHover={{ backgroundColor: 'rgba(196, 32, 50, 0.1)' }}
                                            >
                                                Name
                                            </motion.button>
                                            <motion.button
                                                className={`${styles.dropdownItem} ${sortOption === 'email' ? styles.active : ''}`}
                                                onClick={() => {
                                                    setSortOption('email');
                                                    setShowSortMenu(false);
                                                }}
                                                whileHover={{ backgroundColor: 'rgba(196, 32, 50, 0.1)' }}
                                            >
                                                Email
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className={styles.resultsInfo}>
                        <p className={styles.resultsText}>
                            Showing <span className={styles.highlight}>{sortedUsers.length}</span> {selectedRole}{sortedUsers.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </motion.div>

                {/* Content Section */}
                <motion.div 
                    className={styles.contentSection}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <motion.div 
                                className={styles.loadingSpinner}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                            <p className={styles.loadingText}>Loading users...</p>
                        </div>
                    ) : sortedUsers.length === 0 ? (
                        <motion.div 
                            className={styles.emptyState}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className={styles.emptyIcon}>
                                <FiUsers />
                            </div>
                            <h3 className={styles.emptyTitle}>No users found</h3>
                            <p className={styles.emptyDescription}>
                                {searchTerm ? "Try adjusting your search filters" : "No users in this role yet"}
                            </p>
                            {!searchTerm && (
                                <motion.button 
                                    className={styles.emptyButton}
                                    onClick={addUser}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiPlus /> Create First User
                                </motion.button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            className={styles.usersGrid}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatePresence mode="popLayout">
                                {sortedUsers.map((user) => (
                                    <motion.div 
                                        key={user.id}
                                        variants={itemVariants}
                                        exit="exit"
                                        layout
                                    >
                                        <UserCard 
                                            id={user.id} 
                                            avatar={user.avatar_url} 
                                            name={`${user.first_name} ${user.last_name}`} 
                                            email={user.email}
                                            username={user.username}
                                            role={user.role}
                                            jobTitle={user.job_title}
                                            department={user.department}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </PageAnimate>
    );
};

export default ViewUsers;
