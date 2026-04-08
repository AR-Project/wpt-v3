import { createFileRoute, Link } from "@tanstack/react-router";

import { CategoryList } from "@/features/category/components/CategoryList";
import CreateCategoryForm from "@/features/category/components/CreateCategoryForm";

import { useGetCategory } from "@/features/category/api/hooks";
import { getCategoryQueryOpt } from "@/features/category/api/queries";
import BackToHomeBtn from "@/components/BackToHomeBtn";

export const Route = createFileRoute("/_authenticated/category")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(getCategoryQueryOpt),
	component: CategoryPage,
});

function CategoryPage() {
	const { data, isLoading } = useGetCategory();

	return (
		<>
			<BackToHomeBtn pageName="Category" />
			<div className="p-2">
				{!isLoading && data && <CategoryList categories={data} />}
				<div>
					<div>New Category</div>
					<CreateCategoryForm />
				</div>
			</div>
		</>
	);
}
