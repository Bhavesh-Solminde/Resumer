import React from "react";
import PersonalDetails from "./forms/PersonalDetails";
import Education from "./forms/Education";
import Skills from "./forms/Skills";
import Projects from "./forms/Projects";

const ResumeForm = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6 pb-20">
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          👤 Personal Details
        </h3>
        <PersonalDetails data={data} onUpdate={onUpdate} />
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <Education
          education={data.education}
          onUpdate={onUpdate}
          formData={data}
        />
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <Skills skills={data.skills} onUpdate={onUpdate} formData={data} />
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <Projects
          projects={data.projects}
          onUpdate={onUpdate}
          formData={data}
        />
      </div>
    </div>
  );
};

export default ResumeForm;
