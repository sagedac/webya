import type { ComponentType } from "react";
import type { TenantWithContent } from "@/lib/types";
import { TrazoJoyas } from "@/custom/trazojoyas/TrazoJoyas";
import { DeluxTravel } from "@/custom/deluxtravel/DeluxTravel";
import { Moonvet } from "@/custom/moonvet/Moonvet";
import { JMJPainting } from "@/custom/jmj/JMJPainting";
import { TravelAgency } from "@/custom/travel-agency/TravelAgency";
import { JYWCC } from "@/custom/jyw-cc/JYWCC";
import { Sagedac } from "@/custom/sagedac/Sagedac";
import { EstudioArquitectura } from "@/custom/estudio-arquitectura/EstudioArquitectura";

// Registro de tenants "código a medida" (webya.md sección 5, plan =
// custom_code). Cada cliente se construye a mano (Antigravity/Claude Code,
// Flujo A) como un componente propio bajo src/custom/{slug}/, y se agrega
// acá para que src/app/[slug]/page.tsx sepa renderizarlo — mismo mecanismo
// que CATALOGO_PLANTILLAS para tenants tipo "template", pero sin catálogo
// reutilizable: cada entrada es única para ese cliente.
export const REGISTRO_CUSTOM: Record<string, ComponentType<TenantWithContent>> = {
  trazojoyas: TrazoJoyas,
  deluxtravel: DeluxTravel,
  moonvet: Moonvet,
  jmj: JMJPainting,
  "travel-agency": TravelAgency,
  "jyw-cc": JYWCC,
  sagedac: Sagedac,
  "estudio-arquitectura": EstudioArquitectura,
};
