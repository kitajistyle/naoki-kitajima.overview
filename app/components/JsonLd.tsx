export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "北島直樹",
        "alternateName": "Naoki Kitajima",
        "url": "https://naoki-kitajima.com", // TODO: Replace with actual domain
        "jobTitle": "Engineer",
        "description": "エンジニア 北島直樹のポートフォリオサイト。Web開発を中心に活動中。",
        "sameAs": [
            // TODO: Add social links if available
            // "https://twitter.com/your_account",
            // "https://github.com/kitajistyle"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
