import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type ProjectCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  technologies: string[]
}

export function ProjectCard({ icon, title, description, technologies }: ProjectCardProps) {
  return (
    <Card className="bg-card/30 backdrop-blur-sm border-white/10 hover:bg-card/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 group">
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-blue-500/20 border border-white/10 group-hover:from-orange-500/30 group-hover:to-blue-500/30 transition-all duration-300">
            {icon}
          </div>
          <CardTitle className="text-xl text-foreground group-hover:text-gradient transition-all duration-300">
            {title}
          </CardTitle>
        </div>
        <CardDescription className="text-muted-foreground leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-white/5 border-white/20 text-white/80 hover:bg-white/10 transition-all duration-300"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
