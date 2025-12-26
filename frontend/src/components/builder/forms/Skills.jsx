import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench } from "lucide-react";

const Skills = ({ skills, onUpdate, formData }) => {
  const handleChange = (category, value) => {
    onUpdate({
      ...formData,
      skills: { ...skills, [category]: value },
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Wrench className="h-5 w-5" /> Technical Skills
      </h3>
      <div className="space-y-4">
        {Object.entries(skills).map(([category, value]) => (
          <div key={category} className="space-y-1">
            <Label className="capitalize">{category}</Label>
            <Input
              value={value}
              onChange={(e) => handleChange(category, e.target.value)}
              placeholder={`E.g. React, Node.js`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
