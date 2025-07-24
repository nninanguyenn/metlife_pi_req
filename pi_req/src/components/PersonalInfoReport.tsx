import React, { useState, useEffect } from 'react';
import './PersonalInfoReport.css';

interface PersonalInfoRequest {
  id: string;
  referenceId: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  dateRequested: string;
  status: 'pending' | 'completed' | 'processing';
  requestType: string[];
  pdfPath: string;
}

export const PersonalInfoReport: React.FC = () => {
  const [requests, setRequests] = useState<PersonalInfoRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PersonalInfoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PersonalInfoRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');

  useEffect(() => {
    // Simulate loading past requests
    const simulateLoadingRequests = () => {
      setTimeout(() => {
        const mockRequests: PersonalInfoRequest[] = [
          {
            id: '1',
            referenceId: 'REF-2024-001233',
            firstName: 'Nina',
            lastName: 'Nguyen',
            address: '4021 Philmont Dr, Marietta, GA 30066',
            email: 'nina.nguyen@metlife.com',
            dateRequested: '2025-07-22',
            status: 'processing',
            requestType: ['Access to Personal Information'],
            pdfPath: '/detailed-personal-info-report.pdf'
          },
          {
            id: '2',
            referenceId: 'REF-2024-001234',
            firstName: 'John',
            lastName: 'Smith',
            address: '123 Main St, New York, NY 10001',
            email: 'john.smith@email.com',
            dateRequested: '2024-01-15',
            status: 'completed',
            requestType: ['Access to Personal Information', 'Data Correction'],
            pdfPath: '/detailed-personal-info-report.pdf'
          },
          {
            id: '3',
            referenceId: 'REF-2024-001235',
            firstName: 'Jane',
            lastName: 'Doe',
            address: '456 Oak Ave, Los Angeles, CA 90210',
            email: 'jane.doe@email.com',
            dateRequested: '2024-01-20',
            status: 'processing',
            requestType: ['Access to Personal Information'],
            pdfPath: '/detailed-personal-info-report.pdf'
          },
          {
            id: '4',
            referenceId: 'REF-2024-001236',
            firstName: 'Michael',
            lastName: 'Johnson',
            address: '789 Pine Rd, Chicago, IL 60601',
            email: 'michael.johnson@email.com',
            dateRequested: '2024-01-25',
            status: 'pending',
            requestType: ['Data Deletion', 'Data Correction'],
            pdfPath: '/detailed-personal-info-report.pdf'
          },
          {
            id: '5',
            referenceId: 'REF-2024-001237',
            firstName: 'Sarah',
            lastName: 'Williams',
            address: '321 Elm St, Miami, FL 33101',
            email: 'sarah.williams@email.com',
            dateRequested: '2024-02-01',
            status: 'completed',
            requestType: ['Access to Personal Information', 'Data Portability'],
            pdfPath: '/detailed-personal-info-report.pdf'
          },
          {
            id: '6',
            referenceId: 'REF-2024-001238',
            firstName: 'David',
            lastName: 'Brown',
            address: '654 Maple Ave, Seattle, WA 98101',
            email: 'david.brown@email.com',
            dateRequested: '2024-02-05',
            status: 'processing',
            requestType: ['Data Correction', 'Opt-out of Marketing'],
            pdfPath: '/detailed-personal-info-report.pdf'
          },
          {
            id: '7',
            referenceId: 'REF-2024-001239',
            firstName: 'Emily',
            lastName: 'Davis',
            address: '987 Cedar Ln, Boston, MA 02101',
            email: 'emily.davis@email.com',
            dateRequested: '2024-02-10',
            status: 'completed',
            requestType: ['Access to Personal Information'],
            pdfPath: '/detailed-personal-info-report.pdf'
          }
        ];
        setRequests(mockRequests);
        setFilteredRequests(mockRequests);
        setLoading(false);
      }, 1000);
    };

    simulateLoadingRequests();
  }, []);

  // Filter requests based on search term and status
  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  const handleViewReport = (request: PersonalInfoRequest) => {
    setSelectedRequest(request);
  };

  const handleDownloadPDF = (pdfPath: string, referenceId: string) => {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = `Personal-Info-Report-${referenceId}.pdf`;
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'processing': return '#ffc107';
      case 'pending': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'processing': return 'Processing';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="personal-info-report">
        <div className="report-header">
          <h2>Personal Information Reports</h2>
          <p>Access your personal information request history</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="personal-info-report">
      <div className="report-header">
        <h2>Personal Information Reports</h2>
        <p>Access your personal information request history and download reports</p>
      </div>

      <div className="search-filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, reference ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'processing' | 'completed')}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="reports-stats">
        <div className="stat-item">
          <span className="stat-number">{filteredRequests.length}</span>
          <span className="stat-label">Total Requests</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredRequests.filter(r => r.status === 'completed').length}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredRequests.filter(r => r.status === 'processing').length}</span>
          <span className="stat-label">Processing</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredRequests.filter(r => r.status === 'pending').length}</span>
          <span className="stat-label">Pending</span>
        </div>
      </div>

      <div className="chart-container">
        <h3>Request Types Distribution</h3>
        <div className="chart-bars">
          {(() => {
            const requestTypeCount = filteredRequests.reduce((acc, request) => {
              request.requestType.forEach(type => {
                acc[type] = (acc[type] || 0) + 1;
              });
              return acc;
            }, {} as Record<string, number>);

            const maxCount = Math.max(...Object.values(requestTypeCount));
            
            return Object.entries(requestTypeCount).map(([type, count]) => (
              <div key={type} className="chart-bar-item">
                <div className="chart-bar-label">{type}</div>
                <div className="chart-bar-container">
                  <div 
                    className="chart-bar" 
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  >
                    <span className="chart-bar-count">{count}</span>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      <div className="reports-container">
        {filteredRequests.length === 0 ? (
          <div className="no-reports">
            {requests.length === 0 ? (
              <>
                <p>No personal information requests found.</p>
                <p>Submit a new request using the Personal Info Request tab.</p>
              </>
            ) : (
              <>
                <p>No requests match your search criteria.</p>
                <p>Try adjusting your search terms or filters.</p>
              </>
            )}
          </div>
        ) : (
          <div className="reports-grid">
            {filteredRequests.map((request) => (
              <div key={request.id} className="report-card">
                <div className="report-card-header">
                  <h3>{request.firstName} {request.lastName}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(request.status) }}
                  >
                    {getStatusText(request.status)}
                  </span>
                </div>
                
                <div className="report-card-body">
                  <div className="report-info">
                    <p><strong>Reference ID:</strong> {request.referenceId}</p>
                    <p><strong>Date Requested:</strong> {new Date(request.dateRequested).toLocaleDateString()}</p>
                    <p><strong>Email:</strong> {request.email}</p>
                    <p><strong>Address:</strong> {request.address}</p>
                  </div>
                  
                  <div className="request-types">
                    <p><strong>Request Type:</strong></p>
                    <ul>
                      {request.requestType.map((type, index) => (
                        <li key={index}>{type}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="report-card-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleViewReport(request)}
                    disabled={request.status === 'pending'}
                  >
                    View Details
                  </button>
                  {request.status === 'completed' && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleDownloadPDF(request.pdfPath, request.referenceId)}
                    >
                      Download PDF
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Personal Information Report Details</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedRequest(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="report-details">
                <h4>Request Information</h4>
                <p><strong>Reference ID:</strong> {selectedRequest.referenceId}</p>
                <p><strong>Name:</strong> {selectedRequest.firstName} {selectedRequest.lastName}</p>
                <p><strong>Email:</strong> {selectedRequest.email}</p>
                <p><strong>Address:</strong> {selectedRequest.address}</p>
                <p><strong>Date Requested:</strong> {new Date(selectedRequest.dateRequested).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {getStatusText(selectedRequest.status)}</p>

                <h4>Why We're Contacting You</h4>
                <p>You have requested access to your personal information that MetLife maintains about you in accordance with applicable privacy laws.</p>

                <h4>What You Need to Know</h4>
                <p>This report contains all personal information we have collected and processed about you, including data from various sources and systems.</p>

                <h4>What You Need to Do</h4>
                <p>Please review this information carefully. If you notice any inaccuracies or have questions about how your information is being used, please contact us immediately.</p>

                <h4>We're Here to Help</h4>
                <p>For questions about this report or your personal information, contact us at:</p>
                <ul>
                  <li>Phone: 1-800-METLIFE (1-800-638-5433)</li>
                  <li>Email: privacy@metlife.com</li>
                  <li>Mail: MetLife Privacy Office, 200 Park Avenue, New York, NY 10166</li>
                </ul>

                <h4>Information Sources</h4>
                <p>MetLife collected information from the following sources:</p>
                <ul>
                  <li>Application forms and enrollment documents</li>
                  <li>Claims and benefit administration systems</li>
                  <li>Customer service interactions</li>
                  <li>Third-party data providers</li>
                  <li>Public records and databases</li>
                </ul>

                <h4>Purpose of Collection</h4>
                <p>We collect and process your personal information for:</p>
                <ul>
                  <li>Policy administration and claims processing</li>
                  <li>Customer service and support</li>
                  <li>Legal and regulatory compliance</li>
                  <li>Fraud prevention and risk assessment</li>
                  <li>Marketing and communication (with consent)</li>
                </ul>

                <h4>Information Disclosures</h4>
                <p>Your information may be disclosed outside MetLife to:</p>
                <ul>
                  <li>Service providers and business partners</li>
                  <li>Regulatory authorities as required by law</li>
                  <li>Healthcare providers for claims processing</li>
                  <li>Legal counsel in connection with legal proceedings</li>
                  <li>Other parties with your explicit consent</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              {selectedRequest.status === 'completed' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleDownloadPDF(selectedRequest.pdfPath, selectedRequest.referenceId)}
                >
                  Download Full Report PDF
                </button>
              )}
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
