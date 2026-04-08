import { Link } from "@tanstack/react-router";
import { MdArrowBack } from "react-icons/md";

type Props = {
	pageName: string;
};

export default function BackToHomeBtn({ pageName }: Props) {
	return (
		<div className="flex flex-col bg-blue-400 p-2">
			<Link to="/dashboard">
				<div className="flex flex-row gap-2 items-center hover:underline">
					<MdArrowBack />
					Back to Home
				</div>
			</Link>
			<div className="font-bold text-xl">{pageName}</div>
		</div>
	);
}
