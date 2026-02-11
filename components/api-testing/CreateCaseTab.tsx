"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const createKYCSchema = z.object({
  caseId: z.string().min(1, 'Case ID is required'),
  clientRef: z.string().min(1, 'Client Reference is required'),
  legalName: z.string().min(1, 'Legal Name is required'),
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
  contactEmail: z.string().email('Valid email address is required'),
  relationshipType: z.enum(['NEW', 'EXISTING']),
  systemRequired: z.string().min(1, 'System Required is required'),
  primaryRole: z.enum(['CLIENT', 'UNDERWRITER', 'BROKER', 'REINSURER', 'COVERHOLDER', 'MANAGING_AGENT']),
  subType: z.string().optional(),
  ruleSetId: z.string().min(1, 'Rule Set ID is required'),
});

type CreateKYCFormValues = z.infer<typeof createKYCSchema>;

export function CreateCaseTab() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const form = useForm<CreateKYCFormValues>({
    resolver: zodResolver(createKYCSchema),
    defaultValues: {
      caseId: '',
      clientRef: '',
      legalName: '',
      jurisdiction: 'GB',
      contactEmail: '',
      relationshipType: 'NEW',
      systemRequired: 'PAS',
      primaryRole: 'CLIENT',
      subType: '',
      ruleSetId: 'DEFAULT_RULESET_V1',
    },
  });

  const handleSubmit = async (values: CreateKYCFormValues) => {
    setLoading(true);
    setResponse(null);

    try {
      const now = new Date().toISOString();

      const payload = {
        caseId: values.caseId,
        clientRef: values.clientRef,
        status: 'DRAFT',
        version: 1,
        entity: {
          legalName: values.legalName,
          jurisdiction: values.jurisdiction,
          contactEmail: values.contactEmail,
        },
        relationship: {
          type: values.relationshipType,
          systemRequired: values.systemRequired,
        },
        role: {
          primary: values.primaryRole,
          ...(values.subType && { subType: values.subType }),
        },
        rulesOutcome: {
          ruleSetId: values.ruleSetId,
          requiredDocuments: ['KYC_FORM', 'PROOF_OF_ADDRESS'],
          optionalDocuments: ['ADDITIONAL_INFO'],
        },
        enrichment: {
          companiesHouse: {
            status: 'PENDING',
            checkedAt: now,
          },
          fca: {
            status: 'PENDING',
            checkedAt: now,
          },
          dnb: {
            status: 'PENDING',
            checkedAt: now,
          },
          lexisNexis: {
            status: 'PENDING',
            checkedAt: now,
          },
        },
        documents: [],
        flags: [],
        approvals: [],
        decision: {
          outcome: null,
          decidedBy: null,
          decidedAt: null,
          rationale: null,
        },
        changeHistory: [],
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));

      const res = await fetch('/api/kyc-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('API Response:', data);

      if (!res.ok) {
        // Extract detailed validation errors if available
        const errorMessage = data.detail
          ? (Array.isArray(data.detail)
              ? data.detail.map((e: any) => `${e.loc?.join('.')}: ${e.msg}`).join(', ')
              : JSON.stringify(data.detail))
          : (data.error || 'Failed to create KYC record');
        throw new Error(errorMessage);
      }

      setResponse(data);
      toast.success('KYC Record created successfully!', {
        description: `Record ID: ${data.id}`,
      });

      // Reset form
      form.reset();

    } catch (error: any) {
      console.error('Error creating KYC record:', error);
      toast.error('Failed to create KYC record', {
        description: error.message,
      });
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Create KYC Record</h3>
        <p className="text-sm text-muted-foreground">
          Create a new KYC Master Record in the system via the Core API
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Record Details</CardTitle>
            <CardDescription>Enter the details for the new KYC record</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {/* Case ID */}
                <FormField
                  control={form.control}
                  name="caseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case ID *</FormLabel>
                      <FormControl>
                        <Input placeholder="CASE-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Client Reference */}
                <FormField
                  control={form.control}
                  name="clientRef"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Reference *</FormLabel>
                      <FormControl>
                        <Input placeholder="CLIENT-REF-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Legal Name */}
                <FormField
                  control={form.control}
                  name="legalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corporation Ltd" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Jurisdiction */}
                <FormField
                  control={form.control}
                  name="jurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jurisdiction *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select jurisdiction" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="GB">United Kingdom (GB)</SelectItem>
                          <SelectItem value="US">United States (US)</SelectItem>
                          <SelectItem value="IE">Ireland (IE)</SelectItem>
                          <SelectItem value="FR">France (FR)</SelectItem>
                          <SelectItem value="DE">Germany (DE)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Email */}
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Relationship Type */}
                <FormField
                  control={form.control}
                  name="relationshipType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="EXISTING">Existing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* System Required */}
                <FormField
                  control={form.control}
                  name="systemRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Required *</FormLabel>
                      <FormControl>
                        <Input placeholder="PAS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Primary Role */}
                <FormField
                  control={form.control}
                  name="primaryRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Role *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select primary role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CLIENT">Client</SelectItem>
                          <SelectItem value="UNDERWRITER">Underwriter</SelectItem>
                          <SelectItem value="BROKER">Broker</SelectItem>
                          <SelectItem value="REINSURER">Reinsurer</SelectItem>
                          <SelectItem value="COVERHOLDER">Coverholder</SelectItem>
                          <SelectItem value="MANAGING_AGENT">Managing Agent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sub Type */}
                <FormField
                  control={form.control}
                  name="subType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Type (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional sub-type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Rule Set ID */}
                <FormField
                  control={form.control}
                  name="ruleSetId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule Set ID *</FormLabel>
                      <FormControl>
                        <Input placeholder="DEFAULT_RULESET_V1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create KYC Record
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Response */}
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
            <CardDescription>Response from the Core API</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}

            {!loading && !response && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Submit the form to create a KYC record</p>
              </div>
            )}

            {!loading && response && (
              <div className="space-y-4">
                {response.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-600 mt-1">{response.error}</p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium text-green-800">Success</p>
                    </div>
                    <p className="text-sm text-green-700">{response.message}</p>
                    {response.id && (
                      <p className="text-sm text-green-600 mt-2 font-mono">
                        Record ID: {response.id}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4">
                  <Label className="text-sm font-medium mb-2 block">Full Response:</Label>
                  <pre className="bg-slate-50 border rounded-lg p-4 text-xs overflow-auto max-h-96">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
