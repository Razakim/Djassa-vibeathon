import { Building2, ChevronDown, MapPin } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useTenant } from "@/lib/tenant"

export function EntitySwitcher() {
  const { entreprise, agence, agences, setAgence } = useTenant()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 max-w-[280px]">
          <Building2 className="size-4 shrink-0" />
          <span className="truncate text-left">
            <span className="block text-xs text-muted-foreground">{entreprise.nom}</span>
            <span className="block font-medium">{agence.nom}</span>
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Entreprise</DropdownMenuLabel>
        <DropdownMenuItem disabled>{entreprise.nom}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Agences</DropdownMenuLabel>
        {agences.map((a) => (
          <DropdownMenuItem
            key={a.id}
            onClick={() => setAgence(a.id)}
            className={a.id === agence.id ? "bg-accent" : ""}
          >
            <MapPin className="size-4" />
            <span>
              {a.nom}
              <span className="block text-xs text-muted-foreground">{a.ville}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
