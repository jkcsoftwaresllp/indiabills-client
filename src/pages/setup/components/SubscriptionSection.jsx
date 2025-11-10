import { FiBriefcase, FiCalendar, FiChevronDown, FiChevronUp, FiLink, FiRefreshCw, FiTrendingUp, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import styles from './SubscriptionSection.module.css';

const SubscriptionSection = ({ subscriptionData, onRefresh }) => {
  const [expandedOrg, setExpandedOrg] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const toggleOrgExpansion = (orgId) => {
    setExpandedOrg(expandedOrg === orgId ? null : orgId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanStatus = (validTill) => {
    if (!validTill) return 'unknown';
    const today = new Date();
    const expiryDate = new Date(validTill);
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 7) return 'expiring';
    if (daysLeft <= 30) return 'warning';
    return 'active';
  };

  const planStatus = getPlanStatus(subscriptionData.planValidTill);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <FiTrendingUp className={styles.headerIcon} />
          <div>
            <h2 className={styles.title}>Subscription Details</h2>
            <p className={styles.subtitle}>
              Manage your subscription and organization details
            </p>
          </div>
        </div>
        <button 
          className={`${styles.refreshButton} ${refreshing ? styles.refreshing : ''}`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FiRefreshCw />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className={styles.content}>
        {/* Subscription Overview */}
        <div className={styles.subscriptionOverview}>
          <div className={styles.planCard}>
            <div className={styles.planHeader}>
              <h3 className={styles.planName}>
                {subscriptionData.currentPlan || 'Free Plan'}
              </h3>
              <span className={`${styles.planStatus} ${styles[planStatus]}`}>
                {planStatus === 'active' && '✅ Active'}
                {planStatus === 'warning' && '⚠️ Expiring Soon'}
                {planStatus === 'expiring' && '🔴 Expiring'}
                {planStatus === 'expired' && '❌ Expired'}
                {planStatus === 'unknown' && '❓ Unknown'}
              </span>
            </div>
            <div className={styles.planDetails}>
              <div className={styles.planDetail}>
                <FiCalendar className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Valid Till</span>
                  <span className={styles.detailValue}>
                    {formatDate(subscriptionData.planValidTill)}
                  </span>
                </div>
              </div>
              <div className={styles.planDetail}>
                <FiBriefcase className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Organizations</span>
                  <span className={styles.detailValue}>
                    {subscriptionData.totalOrganizations || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organizations List */}
        <div className={styles.organizationsSection}>
          <h3 className={styles.sectionTitle}>Your Organizations</h3>
          
          {subscriptionData.organizations && subscriptionData.organizations.length > 0 ? (
            <div className={styles.organizationsList}>
              {subscriptionData.organizations.map((org) => (
                <div key={org.id} className={styles.organizationCard}>
                  <div className={styles.orgHeader}>
                    <div className={styles.orgInfo}>
                      <div className={styles.orgLogo}>
                        {org.logo ? (
                          <img src={org.logo} alt={org.name} />
                        ) : (
                          <FiBriefcase />
                        )}
                      </div>
                      <div className={styles.orgDetails}>
                        <h4 className={styles.orgName}>{org.name}</h4>
                        <p className={styles.orgType}>{org.type || 'Business'}</p>
                        <p className={styles.orgAddress}>
                          {org.addressLine}, {org.city}, {org.state}
                        </p>
                      </div>
                    </div>
                    <button 
                      className={styles.expandButton}
                      onClick={() => toggleOrgExpansion(org.id)}
                    >
                      {expandedOrg === org.id ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>

                  {expandedOrg === org.id && (
                    <div className={styles.orgExpanded}>
                      <div className={styles.orgSection}>
                        <h5 className={styles.orgSectionTitle}>Login URLs</h5>
                        <div className={styles.loginUrls}>
                          {org.loginUrls && org.loginUrls.map((url, index) => (
                            <div key={index} className={styles.loginUrl}>
                              <FiLink className={styles.linkIcon} />
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                {url}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={styles.orgSection}>
                        <h5 className={styles.orgSectionTitle}>Organization Details</h5>
                        <div className={styles.detailsGrid}>
                          <div className={styles.detail}>
                            <span className={styles.detailLabel}>GSTIN:</span>
                            <span className={styles.detailValue}>{org.gstin || 'N/A'}</span>
                          </div>
                          <div className={styles.detail}>
                            <span className={styles.detailLabel}>Phone:</span>
                            <span className={styles.detailValue}>{org.phone || 'N/A'}</span>
                          </div>
                          <div className={styles.detail}>
                            <span className={styles.detailLabel}>Email:</span>
                            <span className={styles.detailValue}>{org.email || 'N/A'}</span>
                          </div>
                          <div className={styles.detail}>
                            <span className={styles.detailLabel}>Website:</span>
                            <span className={styles.detailValue}>
                              {org.website ? (
                                <a href={`https://${org.website}`} target="_blank" rel="noopener noreferrer">
                                  {org.website}
                                </a>
                              ) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.orgSection}>
                        <h5 className={styles.orgSectionTitle}>Admin/Users</h5>
                        <div className={styles.usersList}>
                          {org.users && org.users.map((user) => (
                            <div key={user.id} className={styles.userCard}>
                              <div className={styles.userAvatar}>
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} />
                                ) : (
                                  <FiUser />
                                )}
                              </div>
                              <div className={styles.userInfo}>
                                <span className={styles.userName}>{user.name}</span>
                                <span className={styles.userRole}>{user.role}</span>
                                <span className={styles.userEmail}>{user.email}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FiBriefcase className={styles.emptyIcon} />
              <h4 className={styles.emptyTitle}>No Organizations Found</h4>
              <p className={styles.emptyText}>
                You haven't created any organizations yet. Complete the setup process to create your first organization.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSection;