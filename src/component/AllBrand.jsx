import React from 'react'

function AllBrand() {

    const brand = [
        {
            imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FMoccona_logo_b0a1972aa2.jpg&w=1200&q=90',
            title: 'A'
        },
        {
            imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FBest_Food_Logo_697a6a0ff6.jpg&w=1200&q=90',
            title: 'B'
        },
        {
            imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FSandee_Rice_Logo_56ffa833d9.jpg&w=1200&q=90',
            title: 'C'
        },
        {
            imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FUniliver_blue_Logo_53683da136.png&w=1200&q=90',
            title: 'D'
        },
        {
            imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FColgate_Logo_afc11bc75a.jpg&w=1200&q=90',
            title: 'E'
        },
        {
            imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FRosdee%20Logo.png&w=1200&q=90',
            title: 'F'
        }, {
            imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FMoccona_logo_b0a1972aa2.jpg&w=1200&q=90',
            title: 'A'
        },
        {
            imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FBest_Food_Logo_697a6a0ff6.jpg&w=1200&q=90',
            title: 'B'
        },
        {
            imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FSandee_Rice_Logo_56ffa833d9.jpg&w=1200&q=90',
            title: 'C'
        },
        {
            imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FUniliver_blue_Logo_53683da136.png&w=1200&q=90',
            title: 'D'
        },
        {
            imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FColgate_Logo_afc11bc75a.jpg&w=1200&q=90',
            title: 'E'
        },
        {
            imgURL: 'https://www.makro.pro/_next/image?url=https%3A%2F%2Fstrapi-cdn.mango-prod.siammakro.cloud%2Fuploads%2FRosdee%20Logo.png&w=1200&q=90',
            title: 'F'
        }
    ]

    return (
        <>
            {brand.map((Item, index) => (
                <div className="block text-center" key={index}>
                    <img
                        src={Item.imgURL}
                        alt=""
                        className="border-round-xl"
                        width={80}
                        height={80}
                    />
                </div>
            ))}
        </>
    )
}

export default AllBrand