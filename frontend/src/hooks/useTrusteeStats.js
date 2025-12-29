import { useState, useEffect } from 'react';
import api from '../services/api';

export const useTrusteeStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await api.get('/trustee/stats');
            setStats(response.data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError(err.response?.data?.message || 'Failed to fetch statistics');
        } finally {
            setLoading(false);
        }
    };

    return { stats, loading, error, refetch: fetchStats };
};
