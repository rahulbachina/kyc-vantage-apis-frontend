"use client"

import { useState } from 'react';
import { ChevronDown, ChevronUp, Code, Send, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ApiInteractionPanelProps {
  request?: {
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: any;
  };
  response?: {
    status: number;
    statusText: string;
    headers?: Record<string, string>;
    body?: any;
  };
  timestamp?: string;
}

export function ApiInteractionPanel({ request, response, timestamp }: ApiInteractionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!request && !response) return null;

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'default';
    if (status >= 400) return 'destructive';
    return 'secondary';
  };

  return (
    <Card className="mt-6 border-blue-200">
      <CardHeader
        className="cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Code size={18} className="text-blue-600" />
            API Request/Response Details
            {timestamp && <span className="text-sm text-muted-foreground font-normal">• {new Date(timestamp).toLocaleString()}</span>}
          </CardTitle>
          <div className="flex items-center gap-2">
            {response && (
              <Badge variant={getStatusColor(response.status)}>
                {response.status} {response.statusText}
              </Badge>
            )}
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Request Section */}
          {request && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Send size={16} className="text-green-600" />
                Request
              </div>
              <div className="bg-muted/50 p-4 rounded-lg space-y-3 font-mono text-xs">
                <div>
                  <span className="text-muted-foreground">Method:</span>
                  <Badge variant="secondary" className="ml-2">{request.method}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">URL:</span>
                  <div className="mt-1 break-all text-blue-600">{request.url}</div>
                </div>
                {request.headers && Object.keys(request.headers).length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Headers:</span>
                    <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                      {JSON.stringify(request.headers, null, 2)}
                    </pre>
                  </div>
                )}
                {request.body && (
                  <div>
                    <span className="text-muted-foreground">Body:</span>
                    <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                      {typeof request.body === 'string' ? request.body : JSON.stringify(request.body, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Response Section */}
          {response && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <ArrowLeft size={16} className="text-blue-600" />
                Response
              </div>
              <div className="bg-muted/50 p-4 rounded-lg space-y-3 font-mono text-xs">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={getStatusColor(response.status)} className="ml-2">
                    {response.status} {response.statusText}
                  </Badge>
                </div>
                {response.headers && Object.keys(response.headers).length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Headers:</span>
                    <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto max-h-48">
                      {JSON.stringify(response.headers, null, 2)}
                    </pre>
                  </div>
                )}
                {response.body && (
                  <div>
                    <span className="text-muted-foreground">Body:</span>
                    <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto max-h-96">
                      {typeof response.body === 'string' ? response.body : JSON.stringify(response.body, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
