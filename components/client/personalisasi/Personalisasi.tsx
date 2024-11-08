"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

type FormData = {
  major: string;
  interests: string[];
  hobbies: string[];
  dreamJob: string;
  currentStatus: string;
  skills: string[];
  strengths: string[];
  challenges: string[];
  workValues: string[];
  preferredWorkEnvironment: string;
};

const CareerPersonalizationForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    major: "",
    interests: [],
    hobbies: [],
    dreamJob: "",
    currentStatus: "",
    skills: [],
    strengths: [],
    challenges: [],
    workValues: [],
    preferredWorkEnvironment: "",
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInput = (field: keyof FormData, value: string) => {
    if (Array.isArray(formData[field])) {
      const values = value.split(",").map((item) => item.trim());
      handleInputChange(field, values);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Format data untuk API
      const assessmentData = {
        answers: formData,
        clientId: "client-id", // TODO: Get from auth context
      };

      // Kirim ke API
      const response = await fetch("/api/client/career-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit assessment");
      }

      // Redirect ke halaman hasil
      router.push("/dashboard/career/results");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      // TODO: Show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Personalisasi Karir</CardTitle>
        <CardDescription>
          Langkah {step} dari {totalSteps} - Mari mulai perjalanan karir Anda
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="major">Jurusan/Program Studi</Label>
              <Input
                id="major"
                placeholder="Contoh: Teknik Informatika"
                value={formData.major}
                onChange={(e) => handleInputChange("major", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentStatus">Status Saat Ini</Label>
              <Select
                value={formData.currentStatus}
                onValueChange={(value) => handleInputChange("currentStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status Anda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Mahasiswa</SelectItem>
                  <SelectItem value="fresh_graduate">Fresh Graduate</SelectItem>
                  <SelectItem value="employed">Sudah Bekerja</SelectItem>
                  <SelectItem value="job_seeker">Mencari Kerja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interests">Minat (pisahkan dengan koma)</Label>
              <Textarea
                id="interests"
                placeholder="Contoh: Teknologi,Desain,DataAnalysis"
                value={formData.interests}
                onChange={(e) => handleArrayInput("interests", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hobbies">Hobi (pisahkan dengan koma)</Label>
              <Textarea
                id="hobbies"
                placeholder="Contoh: Coding,Membaca,Photography"
                value={formData.hobbies}
                onChange={(e) => handleArrayInput("hobbies", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skills">Keterampilan (pisahkan dengan koma)</Label>
              <Textarea
                id="skills"
                placeholder="Contoh: Programming,PublicSpeaking,ProjectManagement"
                value={formData.skills}
                onChange={(e) => handleArrayInput("skills", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strengths">Kekuatan (pisahkan dengan koma)</Label>
              <Textarea
                id="strengths"
                placeholder="Contoh: ProblemSolving,TeamWork,Creativity"
                value={formData.strengths}
                onChange={(e) => handleArrayInput("strengths", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workValues">Nilai Kerja (pisahkan dengan koma)</Label>
              <Textarea
                id="workValues"
                placeholder="Contoh: Work-LifeBalance,Innovation,Growth"
                value={formData.workValues}
                onChange={(e) => handleArrayInput("workValues", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredWorkEnvironment">Lingkungan Kerja yang Diinginkan</Label>
              <Select
                value={formData.preferredWorkEnvironment}
                onValueChange={(value) => handleInputChange("preferredWorkEnvironment", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih lingkungan kerja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="corporate">Korporat</SelectItem>
                  <SelectItem value="government">Pemerintahan</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="remote">Remote/WFH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dreamJob">Pekerjaan Impian</Label>
              <Textarea
                id="dreamJob"
                placeholder="Ceritakan pekerjaan impian Anda dan mengapa Anda tertarik dengan pekerjaan tersebut"
                value={formData.dreamJob}
                onChange={(e) => handleInputChange("dreamJob", e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1 || loading}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Sebelumnya
        </Button>

        {step < totalSteps ? (
          <Button onClick={handleNext} disabled={loading}>
            Selanjutnya
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses
              </>
            ) : (
              "Submit"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CareerPersonalizationForm;