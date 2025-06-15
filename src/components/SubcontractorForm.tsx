
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Subcontractor, SubcontractorFormData } from '@/types/subcontractor';

const formSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  representativeName: z.string().min(1, 'Representative name is required'),
  commercialRegistration: z.string().min(1, 'Commercial registration is required'),
  taxCardNo: z.string().min(1, 'Tax card number is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
});

interface SubcontractorFormProps {
  subcontractor?: Subcontractor;
  onSubmit: (data: SubcontractorFormData) => void;
  onCancel: () => void;
}

export function SubcontractorForm({ subcontractor, onSubmit, onCancel }: SubcontractorFormProps) {
  const form = useForm<SubcontractorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subcontractor?.name || '',
      companyName: subcontractor?.companyName || '',
      representativeName: subcontractor?.representativeName || '',
      commercialRegistration: subcontractor?.commercialRegistration || '',
      taxCardNo: subcontractor?.taxCardNo || '',
      email: subcontractor?.email || '',
      phone: subcontractor?.phone || '',
    },
  });

  const handleSubmit = (data: SubcontractorFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {subcontractor ? 'Edit Subcontractor' : 'Add New Subcontractor'}
        </h2>
        <p className="text-muted-foreground">
          {subcontractor ? 'Update the subcontractor information below.' : 'Fill in the details to add a new subcontractor.'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="representativeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Representative Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter representative name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commercialRegistration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commercial Registration</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter commercial registration" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxCardNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Card No.</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tax card number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {subcontractor ? 'Update Subcontractor' : 'Add Subcontractor'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
