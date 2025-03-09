import MealList from "@/components/meal/MealList";
import MealDeleteDialog from "@/components/meal/MealDeleteDialog";

const MealListPage = () => {
    return (
        <div className="container py-6">
            <MealList />
            <MealDeleteDialog />
        </div>
    );
};

export default MealListPage;