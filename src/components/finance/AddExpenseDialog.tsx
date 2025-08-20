
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { addFinance } from '@/services/financeService';
import { getAllSites } from '@/services/siteService';

// Define the schema for the expense form
const expenseFormSchema = z.object({
  siteId: z.string({ required_error: "Site is required" }),
  category: z.string({ required_error: "Category is required" }),
  date: z.date({ required_error: "Date is required" }),
  amount: z.string({ required_error: "Amount is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a valid number greater than 0",
    }),
  paymentMethod: z.string({ required_error: "Payment method is required" }),
  refNumber: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

// Site options for the form
const categoryOptions = [
  { value: "materials", label: "Materials" },
  { value: "labor", label: "Labor" },
  { value: "equipment", label: "Equipment" },
  { value: "subcontractors", label: "Subcontractors" },
  { value: "permits", label: "Permits" },
  { value: "insurance", label: "Insurance" },
  { value: "utilities", label: "Utilities" },
  { value: "miscellaneous", label: "Miscellaneous" },
];

// Payment method options
const paymentMethodOptions = [
  { value: "credit", label: "Credit Card" },
  { value: "check", label: "Check" },
  { value: "wire", label: "Wire Transfer" },
  { value: "cash", label: "Cash" },
];

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded?: (expense: any) => void;
}

export default function AddExpenseDialog({ 
  open, 
  onOpenChange, 
  onExpenseAdded 
}: AddExpenseDialogProps) {
  const [sites, setSites] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAllSites().then(setSites);
  }, []);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      date: new Date(),
      siteId: '',
      category: '',
      amount: '',
      paymentMethod: '',
      refNumber: '',
      description: '',
      notes: ''
    },
    mode: 'onChange',
  });

  // Watch form values for real-time validation
  const watchedValues = form.watch();
  const isFormValid = form.formState.isValid;

  // Debug form state
  useEffect(() => {
    console.log('Form values:', watchedValues);
    console.log('Form errors:', form.formState.errors);
    console.log('Form is valid:', isFormValid);
  }, [watchedValues, form.formState.errors, isFormValid]);

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('Form data submitted:', data);
      
      // Find the selected site to get siteName
      const selectedSite = sites.find(site => site._id === data.siteId);
      if (!selectedSite) {
        toast.error('Selected site not found');
        return;
      }

      const expensePayload = {
        siteId: data.siteId,
        siteName: selectedSite.siteName,
        category: data.category,
        date: data.date instanceof Date ? data.date.toISOString() : data.date,
        amount: parseFloat(data.amount),
        paymentMethod: data.paymentMethod,
        referenceNumber: data.refNumber || '',
        description: data.description || '',
        notes: data.notes || ''
      };
      
      console.log('Expense payload:', expensePayload);
      
      const savedExpense = await addFinance(expensePayload);
      console.log('Saved expense:', savedExpense);
      
      onExpenseAdded?.(savedExpense);
      toast.success('Expense added successfully');
      form.reset();
      onOpenChange(false);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      toast.error(err.response?.data?.error || err.message || 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-50">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl text-gray-800 font-semibold">Add New Finance Record</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="siteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Site *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                          <SelectValue placeholder="Select site" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {sites.map((site) => (
                          <SelectItem key={site._id} value={site._id} className="hover:bg-blue-50">
                            <div className="flex flex-col">
                              <span className="font-medium">{site.siteName}</span>
                              <span className="text-xs text-gray-500">{site.siteCode}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-2 border-green-200 hover:border-green-300 focus:border-green-500 transition-colors">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="hover:bg-green-50">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700 font-medium">Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-white border-2 border-purple-200 hover:border-purple-300 focus:border-purple-500 transition-colors",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0.00" 
                        {...field} 
                        className="bg-white border-2 border-orange-200 hover:border-orange-300 focus:border-orange-500 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-2 border-red-200 hover:border-red-300 focus:border-red-500 transition-colors">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {paymentMethodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="hover:bg-red-50">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="refNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Reference Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Invoice or receipt number" 
                        {...field} 
                        className="bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-gray-500 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Brief description of the expense" 
                      {...field} 
                      className="bg-white border-2 border-teal-200 hover:border-teal-300 focus:border-teal-500 transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional details about this expense" 
                      className="resize-none bg-white border-2 border-indigo-200 hover:border-indigo-300 focus:border-indigo-500 transition-colors" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !form.formState.isValid}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Expense'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
