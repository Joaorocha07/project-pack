import Imagee from '../images/pack-do-criador.png'

export default function CustomHead(): JSX.Element {
  return (
    <>
      <title>Pack do Criador - 8000 Figurinhas para Instagram Stories</title>
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <meta name="description" content="Transforme seus Stories do Instagram com mais de 8000 figurinhas profissionais. Stories criativos e extraordinários em poucos cliques." />
      <link
        rel="icon"
        href={Imagee.src}
        type="image/svg+xml"
        sizes="any"
      />
    </>
  )
}
