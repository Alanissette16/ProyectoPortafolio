import React, { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
}

const SEOHead: React.FC<SEOProps> = ({
    title,
    description = "FOREING - Estudio de diseño y desarrollo digital. Creamos experiencias únicas.",
    image = "/og-image.png",
    url = window.location.href
}) => {
    useEffect(() => {
        // Actualizar Título
        document.title = `${title} | FOREING`;

        // Metadatos a actualizar
        const metaTags = [
            { name: 'description', content: description },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:image', content: image },
            { property: 'og:url', content: url },
            { property: 'twitter:title', content: title },
            { property: 'twitter:description', content: description },
            { property: 'twitter:image', content: image },
        ];

        metaTags.forEach(tag => {
            let element;
            if (tag.name) {
                element = document.querySelector(`meta[name="${tag.name}"]`);
            } else {
                element = document.querySelector(`meta[property="${tag.property}"]`);
            }

            if (element) {
                element.setAttribute('content', tag.content);
            } else {
                // Crear si no existe (opcional, index.html ya tiene defaults)
                const newMeta = document.createElement('meta');
                if (tag.name) newMeta.setAttribute('name', tag.name);
                if (tag.property) newMeta.setAttribute('property', tag.property);
                newMeta.setAttribute('content', tag.content);
                document.head.appendChild(newMeta);
            }
        });

    }, [title, description, image, url]);

    return null;
};

export default SEOHead;
