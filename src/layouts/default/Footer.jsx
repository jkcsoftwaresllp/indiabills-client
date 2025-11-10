import { FiHelpCircle, FiSettings } from 'react-icons/fi';
import { useState } from "react";
import { motion } from "framer-motion";

const Footer = () => {

	const [popDown, setPopDown] = useState(true);

	return (
		<motion.div
			initial={{
				translateY: "100px",
			}}
			animate={{
				translateY: popDown ? "0px" : "100px",
			}}
			transition={{
				duration: 1,
				type: "spring",
			}}
			// onClick={() => setPopDown(!popDown)}
			className="flex-wrap fixed bottom-0 w-full flex py-5 px-12 items-center text-slate-500 rounded-lg border backdrop-filter backdrop-blur-lg bg-white bg-opacity-40"
			// className="flex-wrap fixed bottom-0 w-full flex py-5 px-12 items-center text-slate-500 rounded-lg bg-transparent"
		>
			<div className="border-2 items-center flex gap-2 rounded-xl w-full">
				<div className="flex ml-2 border-r-2">
				<FiHelpCircle />
				</div>
				<input className="w-full p-2 bg-transparent" placeholder="Smart Chat" type="text" />
			</div>
<FiSettings/>

		</motion.div>
	);
}

export default Footer;
