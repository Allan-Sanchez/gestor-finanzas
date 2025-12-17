import { useState } from 'react';
import { Plus, FolderOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, Button, Loading } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';
import { useIsMobile } from '../hooks/useIsMobile';
import CategoryCard from '../components/categories/CategoryCard';
import MobileCategoryList from '../components/categories/MobileCategoryList';
import CategoryForm from '../components/categories/CategoryForm';
import type { Category, CategoryInsert, CategoryUpdate } from '../types';

export default function CategoriesPage() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { data: categories, isLoading } = useCategories(user?.id);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCreateCategory = async (data: CategoryInsert | CategoryUpdate) => {
    try {
      if (selectedCategory) {
        await updateCategory.mutateAsync({
          id: selectedCategory.id,
          updates: data as CategoryUpdate,
        });
      } else {
        await createCategory.mutateAsync(data as CategoryInsert);
      }
      setIsFormOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('Error al guardar la categoría. Por favor intenta nuevamente.');
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      alert('Error al eliminar la categoría. Por favor intenta nuevamente.');
    }
  };

  const handleNewCategory = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  // Separar categorías por tipo
  const incomeCategories = categories?.filter((c) => c.type === 'income') || [];
  const expenseCategories = categories?.filter((c) => c.type === 'expense') || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Organiza tus transacciones en categorías</p>
        </div>
        <Button onClick={handleNewCategory} className="w-full sm:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Categorías de Ingreso</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{incomeCategories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Categorías de Egreso</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{expenseCategories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {categories && categories.length > 0 ? (
        <>
          {/* Income Categories */}
          {incomeCategories.length > 0 && (
            <div>
              <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                Categorías de Ingreso
              </h2>
              {isMobile ? (
                <MobileCategoryList
                  categories={incomeCategories}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {incomeCategories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onEdit={handleEditCategory}
                      onDelete={handleDeleteCategory}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Expense Categories */}
          {expenseCategories.length > 0 && (
            <div>
              <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                Categorías de Egreso
              </h2>
              {isMobile ? (
                <MobileCategoryList
                  categories={expenseCategories}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {expenseCategories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onEdit={handleEditCategory}
                      onDelete={handleDeleteCategory}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes categorías registradas
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza creando categorías para organizar tus ingresos y gastos
            </p>
            <Button onClick={handleNewCategory}>
              <Plus className="w-5 h-5 mr-2" />
              Crear Primera Categoría
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Category Form Modal */}
      {user && (
        <CategoryForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedCategory(null);
          }}
          onSubmit={handleCreateCategory}
          category={selectedCategory}
          userId={user.id}
          isLoading={createCategory.isPending || updateCategory.isPending}
        />
      )}
    </div>
  );
}
