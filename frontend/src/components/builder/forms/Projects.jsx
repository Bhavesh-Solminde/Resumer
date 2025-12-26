import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, FolderGit2 } from "lucide-react";

const Projects = ({ projects, onUpdate, formData }) => {
  const handleProjectChange = (index, field, value) => {
    const newProj = [...projects];
    newProj[index] = { ...newProj[index], [field]: value };
    onUpdate({ ...formData, projects: newProj });
  };

  const addProject = () => {
    onUpdate({
      ...formData,
      projects: [
        ...projects,
        { title: "", subtitle: "", date: "", link: "", points: [""] },
      ],
    });
  };

  const removeProject = (index) => {
    onUpdate({ ...formData, projects: projects.filter((_, i) => i !== index) });
  };

  const handlePointChange = (projIndex, ptIndex, value) => {
    const newProj = [...projects];
    newProj[projIndex].points[ptIndex] = value;
    onUpdate({ ...formData, projects: newProj });
  };

  const addPoint = (projIndex) => {
    const newProj = [...projects];
    newProj[projIndex].points.push("");
    onUpdate({ ...formData, projects: newProj });
  };

  const removePoint = (projIndex, ptIndex) => {
    const newProj = [...projects];
    newProj[projIndex].points = newProj[projIndex].points.filter(
      (_, i) => i !== ptIndex
    );
    onUpdate({ ...formData, projects: newProj });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FolderGit2 className="h-5 w-5" /> Projects
        </h3>
        <Button variant="outline" size="sm" onClick={addProject}>
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
      </div>

      <div className="space-y-6">
        {projects.map((proj, i) => (
          <div
            key={i}
            className="p-4 bg-muted/30 rounded-lg relative border hover:border-primary/50 transition-colors"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
              onClick={() => removeProject(i)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 pr-8">
              <Input
                placeholder="Project Title"
                className="font-semibold"
                value={proj.title}
                onChange={(e) =>
                  handleProjectChange(i, "title", e.target.value)
                }
              />
              <Input
                placeholder="Tech Stack / Subtitle"
                value={proj.subtitle}
                onChange={(e) =>
                  handleProjectChange(i, "subtitle", e.target.value)
                }
              />
              <Input
                placeholder="Date"
                value={proj.date}
                onChange={(e) => handleProjectChange(i, "date", e.target.value)}
              />
              <Input
                placeholder="Live/Github Link"
                value={proj.link}
                onChange={(e) => handleProjectChange(i, "link", e.target.value)}
              />
            </div>

            <div className="pl-4 border-l-2 border-primary/20 space-y-2">
              <Label className="text-xs text-muted-foreground">
                Bullet Points
              </Label>
              {proj.points.map((point, ptIndex) => (
                <div key={ptIndex} className="flex gap-2">
                  <Input
                    value={point}
                    onChange={(e) =>
                      handlePointChange(i, ptIndex, e.target.value)
                    }
                    className="h-8 text-sm"
                    placeholder="Describe your contribution..."
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removePoint(i, ptIndex)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <Button
                variant="link"
                size="sm"
                className="h-6 px-0 text-primary"
                onClick={() => addPoint(i)}
              >
                + Add Point
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
