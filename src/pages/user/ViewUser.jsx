import { useEffect, useState } from "react";
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getData } from "../../network/api";
import UserCard from "../../components/FormComponent/UserCard";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PageAnimate from "../../components/Animate/PageAnimate";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from './styles/ViewUsers.module.css';

const ViewUsers = () => {
    const roles = ["admin", "customer", "operators", "reporter", "delivery"];
    const [users, setUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState(roles[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sorter, setSorter] = useState(false);
    const [sortOption, setSortOption] = useState("name");

    useEffect(() => {
        async function fetchData() {
            const data = await getData(`/users/role/${selectedRole}`);
            setUsers(data);
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
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = filteredUsers.sort((a, b) => {
        if (sortOption === "name") {
            return a.userName.localeCompare(b.userName);
        } else if (sortOption === "email") {
            return a.email.localeCompare(b.email);
        }
        return 0;
    });

    const itemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    };

  return (
  <PageAnimate>
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.roleSelectWrapper}>
          <h1 className={styles.roleTitle}>
            {selectedRole ? capitalize(selectedRole) : 'Select a Role'}
          </h1>
          <span className={styles.expandIcon}><ExpandMoreIcon /></span>
          <select
            className={styles.select}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roles.map((role) => (
              <option key={role} value={role} className={styles.option}>
                {capitalize(role)}
              </option>
            ))}
          </select>
        </div>

        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div id="sort" className={styles.sortWrapper}>
          <FilterListIcon
            onClick={() => setSorter(!sorter)}
            style={{ fontSize: 40 }}
          />
          {sorter && (
            <div className={styles.sortDropdown}>
              <button
                className={styles.sortButtonTop}
                onClick={() => {
                  setSortOption('name');
                  setSorter(false);
                }}
              >
                Name
              </button>
              <button
                className={styles.sortButtonBottom}
                onClick={() => {
                  setSortOption('email');
                  setSorter(false);
                }}
              >
                Email
              </button>
            </div>
          )}
        </div>
      </div>

      <hr className={styles.separator} />

      <div className={styles.userGrid}>
        <AnimatePresence>
          {sortedUsers.length > 0 &&
            sortedUsers.map((user) => (
              <motion.div
                key={user.userId}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <UserCard
                  id={user.userId}
                  avatar={user.avatar}
                  name={user.userName}
                  email={user.email}
                />
              </motion.div>
            ))}
        </AnimatePresence>

        <motion.div
          className={styles.addUserCard}
          onClick={addUser}
          style={{ fontSize: 50, minHeight: '205.367px' }}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
        >
          <AddCircleOutlineIcon />
        </motion.div>
      </div>
    </div>
  </PageAnimate>
);
};

export default ViewUsers;
