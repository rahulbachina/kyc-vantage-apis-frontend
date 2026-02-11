"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Plus, CheckCircle2 } from 'lucide-react';

interface KYCRecordCreate {
  caseId: string;
  clientRef: string;
  status: string;
  version: number;
  entity: {
    legalName: string;
    jurisdiction: string;
    contactEmail: string;
  };
  relationship: {
    type: string;
    systemRequired: string;
  };
  role: {
    primary: string;
    subType?: string;
  };
  rulesOutcome: {
    ruleSetId: string;
    requiredDocuments: string[];
    optionalDocuments: string[];
  };
  enrichment: {
    companiesHouse: {
      status: string;
      checkedAt: string;
    };
    fca: {
      status: string;
      checkedAt: string;
    };
    dnb: {
      status: string;
      checkedAt: string;
    };
    lexisNexis: {
      status: string;
      checkedAt: string;
    };
  };
  documents: any[];
  flags: any[];
  approvals: any[];
}

export function CreateCaseTab() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const [formData, setFormData] = useState({
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const now = new Date().toISOString();

      const payload: KYCRecordCreate = {
        caseId: formData.caseId,
        clientRef: formData.clientRef,
        status: 'DRAFT',
        version: 1,
        entity: {
          legalName: formData.legalName,
          jurisdiction: formData.jurisdiction,
          contactEmail: formData.contactEmail,
        },
        relationship: {
          type: formData.relationshipType,
          systemRequired: formData.systemRequired,
        },
        role: {
          primary: formData.primaryRole,
          ...(formData.subType && { subType: formData.subType }),
        },
        rulesOutcome: {
          ruleSetId: formData.ruleSetId,
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

      const res = await fetch('/api/cases', {
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
      setFormData({
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
      });

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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Case ID */}
              <div className="space-y-2">
                <Label htmlFor="caseId">Case ID *</Label>
                <Input
                  id="caseId"
                  value={formData.caseId}
                  onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                  placeholder="CASE-001"
                  required
                />
              </div>

              {/* Client Reference */}
              <div className="space-y-2">
                <Label htmlFor="clientRef">Client Reference *</Label>
                <Input
                  id="clientRef"
                  value={formData.clientRef}
                  onChange={(e) => setFormData({ ...formData, clientRef: e.target.value })}
                  placeholder="CLIENT-REF-001"
                  required
                />
              </div>

              {/* Legal Name */}
              <div className="space-y-2">
                <Label htmlFor="legalName">Legal Name *</Label>
                <Input
                  id="legalName"
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                  placeholder="Acme Corporation Ltd"
                  required
                />
              </div>

              {/* Jurisdiction */}
              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction *</Label>
                <Select
                  value={formData.jurisdiction}
                  onValueChange={(value) => setFormData({ ...formData, jurisdiction: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GB">United Kingdom (GB)</SelectItem>
                    <SelectItem value="US">United States (US)</SelectItem>
                    <SelectItem value="IE">Ireland (IE)</SelectItem>
                    <SelectItem value="FR">France (FR)</SelectItem>
                    <SelectItem value="DE">Germany (DE)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contact@example.com"
                  required
                />
              </div>

              {/* Relationship Type */}
              <div className="space-y-2">
                <Label htmlFor="relationshipType">Relationship Type *</Label>
                <Select
                  value={formData.relationshipType}
                  onValueChange={(value) => setFormData({ ...formData, relationshipType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="EXISTING">Existing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* System Required */}
              <div className="space-y-2">
                <Label htmlFor="systemRequired">System Required *</Label>
                <Input
                  id="systemRequired"
                  value={formData.systemRequired}
                  onChange={(e) => setFormData({ ...formData, systemRequired: e.target.value })}
                  placeholder="PAS"
                  required
                />
              </div>

              {/* Primary Role */}
              <div className="space-y-2">
                <Label htmlFor="primaryRole">Primary Role *</Label>
                <Select
                  value={formData.primaryRole}
                  onValueChange={(value) => setFormData({ ...formData, primaryRole: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">Client</SelectItem>
                    <SelectItem value="UNDERWRITER">Underwriter</SelectItem>
                    <SelectItem value="BROKER">Broker</SelectItem>
                    <SelectItem value="REINSURER">Reinsurer</SelectItem>
                    <SelectItem value="COVERHOLDER">Coverholder</SelectItem>
                    <SelectItem value="MANAGING_AGENT">Managing Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sub Type */}
              <div className="space-y-2">
                <Label htmlFor="subType">Sub Type (Optional)</Label>
                <Input
                  id="subType"
                  value={formData.subType}
                  onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                  placeholder="Optional sub-type"
                />
              </div>

              {/* Rule Set ID */}
              <div className="space-y-2">
                <Label htmlFor="ruleSetId">Rule Set ID *</Label>
                <Input
                  id="ruleSetId"
                  value={formData.ruleSetId}
                  onChange={(e) => setFormData({ ...formData, ruleSetId: e.target.value })}
                  placeholder="DEFAULT_RULESET_V1"
                  required
                />
              </div>

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
