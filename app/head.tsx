import Imagee from '../images/pack-do-criador.png'

export default function CustomHead(): JSX.Element {
  return (
    <>
      <title>Pack do Criador - 8000 Figurinhas para Instagram Stories</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="Transforme seus Stories do Instagram com mais de 8000 figurinhas profissionais. Stories criativos e extraordinários em poucos cliques."
      />

      {/* Favicon para navegadores */}
      <link
        rel="icon"
        href={Imagee.src}
        type="image/png"
        sizes="48x48"
      />

      {/* Ícone para dispositivos Apple */}
      <link
        rel="apple-touch-icon"
        href={Imagee.src}
      />

      {/* Cor da barra do navegador */}
      <meta name="theme-color" content="#ffffff" />

      {/* Marcações estruturadas para o Google exibir a logo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Pack do Criador",
            "url": "https://packdocriador.com",
            "logo": "https://packdocriador.com" + Imagee.src
          }),
        }}
      />
    </>
  )
}
