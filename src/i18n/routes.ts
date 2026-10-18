export function languagePaths(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  const plain = path === "/es" ? "/" : path.replace(/^\/es(?=\/)/, "");
  const en = /^\/(agora|trainly|orquestador)$/.test(plain) ? `/en${plain}` : plain;
  const es = en === "/" ? "/es" : `/es${en.replace(/^\/en(?=\/)/, "")}`;
  return { en, es };
}

export function languageAlternates(path: string) {
  const paths = languagePaths(path);
  return { en: paths.en, es: paths.es, "x-default": paths.en };
}
