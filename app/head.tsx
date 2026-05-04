import appleTouchIcon from '../images/android-chrome-192x192.png';
import favicon from '../images/favicon.ico';
import logo from '../images/pack-do-criador.webp';

const siteUrl = 'https://packdocriador.com';
const title = 'Pack do Criador | Figurinhas para Stories, Influencers e Criadores';
const description = 'Pack do Criador: figurinhas premium para Instagram Stories, com area de membros, categorias por nicho e download direto para usar no celular.';
const keywords = [
  'pack do criador',
  'packdocriador',
  'figurinhas para stories',
  'figurinhas instagram',
  'figurinhas para instagram stories',
  'pack de figurinhas',
  'figurinhas para influencer',
  'figurinhas para criadores',
  'figurinhas para loja',
  'stories criativos',
  'adesivos para stories',
  'area de membros pack do criador',
];
const logoUrl = `${siteUrl}${logo.src}`;

export default function CustomHead(): JSX.Element {
  return (
    <>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="author" content="Pack do Criador" />
      <meta name="application-name" content="Pack do Criador" />
      <link rel="canonical" href={siteUrl} />

      <link rel="icon" href={favicon.src} sizes="any" />
      <link rel="apple-touch-icon" href={appleTouchIcon.src} />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />

      <meta property="og:locale" content="pt_BR" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Pack do Criador" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={logoUrl} />
      <meta property="og:image:secure_url" content={logoUrl} />
      <meta property="og:image:alt" content="Logo do Pack do Criador" />
      <meta property="og:image:type" content="image/webp" />
      <meta property="og:image:width" content="1024" />
      <meta property="og:image:height" content="1024" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={logoUrl} />
      <meta name="twitter:image:alt" content="Logo do Pack do Criador" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': `${siteUrl}/#organization`,
                name: 'Pack do Criador',
                url: siteUrl,
                logo: {
                  '@type': 'ImageObject',
                  url: logoUrl,
                  width: 1024,
                  height: 1024,
                },
                sameAs: [siteUrl],
              },
              {
                '@type': 'WebSite',
                '@id': `${siteUrl}/#website`,
                name: 'Pack do Criador',
                url: siteUrl,
                publisher: {
                  '@id': `${siteUrl}/#organization`,
                },
                inLanguage: 'pt-BR',
              },
              {
                '@type': 'Product',
                '@id': `${siteUrl}/#product`,
                name: 'Pack do Criador',
                description,
                image: logoUrl,
                brand: {
                  '@id': `${siteUrl}/#organization`,
                },
                offers: {
                  '@type': 'Offer',
                  url: siteUrl,
                  priceCurrency: 'BRL',
                  price: '29.90',
                  availability: 'https://schema.org/InStock',
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
