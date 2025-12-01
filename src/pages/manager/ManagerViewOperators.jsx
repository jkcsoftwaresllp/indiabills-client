import { FiFilter, FiPlus } from 'react-icons/fi';
import { useEffect, useState } from "react";
import { getUsersByRole } from "../../network/api";
import UserCard from "../../components/FormComponent/UserCard";
import PageAnimate from "../../components/Animate/PageAnimate";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ManagerViewOperators = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sorter, setSorter] = useState(false);
    const [sortOption, setSortOption] = useState("name");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await getUsersByRole('operator');
                if (response.status === 200) {
                    setUsers(response.data);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching operators:', error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const navigate = useNavigate();

    const addOperator = () => {
        navigate('/manager/operators/add');
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
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    };

    return (
        <PageAnimate>
            <div className={"flex flex-col p-4 gap-2 w-full"}>
                <div className="flex justify-between items-center gap-4 mb-4">
                    <div className="relative flex items-center">
                        <h1 className="p-2 text-4xl bg-transparent rounded font-semibold">
                            Operators
                        </h1>
                    </div>
                    <input
                        className="p-2 w-3/5 border rounded-xl"
                        type="text"
                        placeholder="Search by name, email, or username"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div id="sort" className={"flex relative"}>
                        <FiFilter onClick={() => setSorter(!sorter)} style={{ fontSize: 40 }} />
                        {sorter && (
                            <div className="flex flex-col absolute bottom-0 rounded-lg text-sm bg-primary text-slate-300">
                                <button 
                                    className="hover:bg-accent transition p-2 rounded-t-lg" 
                                    onClick={() => {setSortOption("name"); setSorter(false);}}
                                >
                                    Name
                                </button>
                                <button 
                                    className="hover:bg-accent transition p-2 rounded-b-lg" 
                                    onClick={() => {setSortOption("email"); setSorter(false);}}
                                >
                                    Email
                                </button>
                            </div>
                        )}
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
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Loading operators...</div>
                    </div>
                ) : (
                    <div className={"flex p-2 gap-4 flex-wrap"}>
                        <AnimatePresence>
                            {sortedUsers.length > 0 && (
                                sortedUsers.map((user) => (
                                    <motion.div 
                                        key={user.id} 
                                        variants={itemVariants} 
                                        initial="hidden" 
                                        animate="visible" 
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
                                ))
                            )}
                        </AnimatePresence>
                        <motion.div 
                            className="flex justify-center p-4 items-center w-32 min-h-full rounded-lg cursor-pointer text-slate-100 shadow-2xl transition ease-in bg-primary hover:text-accent" 
                            onClick={addOperator} 
                            style={{ fontSize: 50, minHeight: '205.367px' }} 
                            variants={itemVariants} 
                            initial="hidden" 
                            animate="visible" 
                            exit="exit" 
                            layout
                        >
                            <FiPlus />
                        </motion.div>
                    </div>
                )}
            </div>
        </PageAnimate>
    );
};

export default ManagerViewOperators;
