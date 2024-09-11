import axios from 'axios';

function GenerateCategories() {
    const apiProductUrl = import.meta.env.VITE_REACT_APP_API_PARTNER;

    const fetchData = async () => {
        try {
            const response = await axios.get(`${apiProductUrl}/product`);
            const products = response.data.data;

            return generateFiltersFromData(products);
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const generateFiltersFromData = (products) => {
        const uniqueCategories = [...new Set(products.map(product => product.product_category))];

        return uniqueCategories.map((categoryName, index) => ({
            key: index,
            name: categoryName
        }));
    };

    return fetchData();
}

export default GenerateCategories;
