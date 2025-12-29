import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getIdCard } from '../services/idCardService';
import api from '../services/api';

export const useIdCard = () => {
    const { user } = useAuth();
    const [idCardData, setIdCardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchIdCard = async () => {
            try {
                const response = await getIdCard();
                setIdCardData(response.data.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch ID card data');
                console.error('Error fetching ID card:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchIdCard();
    }, []);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            // Directly use the API service to download the PDF
            const response = await api.get('/idcard/download', {
                responseType: 'blob' // Important for handling file downloads
            });

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `id-card-${user?.name?.replace(/\s+/g, '_')}-${idCardData?.idCard?.idNumber || 'temp'}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to download ID card');
            console.error('Error downloading ID card:', err);
        } finally {
            setDownloading(false);
        }
    };

    return {
        idCardData,
        loading,
        error,
        downloading,
        handleDownload,
        user
    };
};
