import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, GraduationCap } from "lucide-react";

const Education = ({ education, onUpdate, formData }) => {
  const handleChange = (index, field, value) => {
    const newEdu = [...education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onUpdate({ ...formData, education: newEdu });
  };

  const addEducation = () => {
    onUpdate({
      ...formData,
      education: [
        ...education,
        { degree: "", institution: "", date: "", details: "", cgpa: "" },
      ],
    });
  };

  const removeEducation = (index) => {
    onUpdate({
      ...formData,
      education: education.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5" /> Education
        </h3>
        <Button variant="outline" size="sm" onClick={addEducation}>
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
      </div>

      <div className="space-y-4">
        {education.map((edu, index) => (
          <div
            key={index}
            className="p-4 bg-muted/30 rounded-lg relative border group hover:border-primary/50 transition-colors"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
              onClick={() => removeEducation(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
              <Input
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
              />
              <Input
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) =>
                  handleChange(index, "institution", e.target.value)
                }
              />
              <Input
                placeholder="Year"
                value={edu.date}
                onChange={(e) => handleChange(index, "date", e.target.value)}
              />
              <Input
                placeholder="CGPA"
                value={edu.cgpa}
                onChange={(e) => handleChange(index, "cgpa", e.target.value)}
              />
              <Input
                className="md:col-span-2"
                placeholder="Details"
                value={edu.details}
                onChange={(e) => handleChange(index, "details", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
