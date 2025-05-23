import { useEffect, useState } from "react";
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { User } from "../../definitions/Types";
import { getData } from "../../network/api";
import UserCard from "../../components/FormComponent/UserCard";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PageAnimate from "../../components/Animate/PageAnimate";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ViewUsers = () => {
    const roles = ["admin", "customer", "operators", "reporter", "delivery"];
    const [users, setUsers] = useState<User[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>(roles[0]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sorter, setSorter] = useState<boolean>(false);
    const [sortOption, setSortOption] = useState<string>("name");

    useEffect(() => {
        async function fetchData() {
            const data: User[] = await getData(`/users/role/${selectedRole}`);
            setUsers(data);
        }

        fetchData();
    }, [selectedRole]);

    const capitalize = (str: string) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const navigate = useNavigate();

    const addUser = () => {
        if (selectedRole === 'customer') {
            navigate('/customers/add')
        } else {
            navigate('/users/add')
        }
    }

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
            <div className={"flex flex-col p-4 gap-2 w-full"}>
                <div className="flex justify-between items-center gap-4 mb-4">
                    <div className="relative flex items-center">
                        <h1 className="p-2 text-4xl bg-transparent rounded font-semibold">{selectedRole ? capitalize(selectedRole) : 'Select a Role'}</h1>
                        <span className="font-semibold"><ExpandMoreIcon/></span>
                        <select className="bg-transparent rounded absolute inset-0 opacity-0" value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}>
                            {roles.map((role) => (
                                <option key={role} value={role} className="capitalize"> {capitalize(role)} </option>
                            ))}
                        </select>
                    </div>
                    <input
                        className="p-2 w-3/5 border rounded-xl"
                        type="text"
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div id="sort" className={"flex relative"}>
                        <FilterListIcon onClick={() => setSorter(!sorter)} style={{ fontSize: 40 }} />
                        {sorter && <div className="flex flex-col absolute bottom-0 rounded-lg text-sm bg-primary text-slate-300">
                            <button className="hover:bg-accent transition p-2 rounded-t-lg" onClick={() => {setSortOption("name"); setSorter(false); } } >Name</button>
                            <button className="hover:bg-accent transition p-2 rounded-b-lg" onClick={() => {setSortOption("email"); setSorter(false); } } >Email</button>
                        </div>}
                    </div>
                </div>
                <hr style={{
                        marginTop: "0.5rem",
                        height: "2px",
                        borderWidth: 0,
                        color: "black",
                        backgroundColor: "lightgray",
                    }}
                />
                <div className={"flex p-2 gap-4 flex-wrap"}>
                    <AnimatePresence>
                        {sortedUsers.length > 0 && (
                            sortedUsers.map((user) => (
                                <motion.div key={user.userId} variants={itemVariants} initial="hidden" animate="visible" exit="exit" layout>
                                    <UserCard id={user.userId} avatar={user.avatar} name={user.userName} email={user.email}/>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                    <motion.div className="flex justify-center p-4 items-center w-32 min-h-full rounded-lg cursor-pointer text-slate-100 shadow-2xl transition ease-in bg-primary hover:text-accent" onClick={addUser} style={{ fontSize: 50, minHeight: '205.367px' }} variants={itemVariants} initial="hidden" animate="visible" exit="exit" layout>
                        <AddCircleOutlineIcon />
                    </motion.div>
                </div>
            </div>
        </PageAnimate>
    );
};

export default ViewUsers;