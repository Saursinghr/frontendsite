
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Material, AddMaterialData } from "@/types/inventory";
import { toast } from "@/hooks/use-toast";
import { addInventoryMaterial, getAllInventory } from "@/services/inventoryService";

export const useMaterials = () => {
  const query = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      try {
        const data = await getAllInventory();
        // Map backend fields to frontend Material type if needed
        return data.map((item: any) => ({
          id: item._id,
          name: item.MaterialName,
          type: item.type || '',
          quantity: item.Quantity,
          unit: item.Unit,
          status: "In Stock", // You can enhance this logic based on your backend data
          stockLevel: item.Quantity,
          lowStockThreshold: 10, // Default or from backend
          targetStockLevel: 100, // Default or from backend
          vendor: item.vendor || '',
          location: item.location || '',
          description: item.description || '',
        }));
      } catch (error: any) {
        toast({ title: 'Error', description: error.message || 'Failed to fetch inventory' });
        return [];
      }
    },
  });

  return {
    materials: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useAddMaterial = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addInventoryMaterial,
    onSuccess: (newMaterial) => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast({
        title: "Material Added",
        description: `${newMaterial.MaterialName} has been added to inventory.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add material. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    addMaterial: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

// Remove useUpdateMaterial hooks for now
