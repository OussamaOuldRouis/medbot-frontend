import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle, 
  Pill, 
  Shield, 
  MessageCircle, 
  Search,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState<'physicians' | 'researchers'>('physicians');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-primary/90 to-primary/70 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pill-pattern.svg')] bg-repeat opacity-5"></div>
        <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-white animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                 <span className="font-normal text-white/90">MedBot </span>
              </h1>
              <p className="text-lg md:text-xl mb-6 text-white/90 max-w-xl">
                The comprehensive AI platform for healthcare professionals to access accurate drug information and interaction data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 hover:text-primary"
                  asChild
                >
                  <Link to="/auth">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 hover:text-primary"
                  asChild
                >
                  <Link to="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative w-full max-w-md">
                <div className="absolute -top-8 -left-8 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60"
                  alt="MedBot Pro Dashboard" 
                  className="w-full h-auto rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-12 justify-center sm:justify-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="h-5 w-5 mr-2 text-white/80" />
              <span className="text-sm text-white/90">Verified medical data</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <MessageCircle className="h-5 w-5 mr-2 text-white/80" />
              <span className="text-sm text-white/90">AI-powered assistance</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <CheckCircle className="h-5 w-5 mr-2 text-white/80" />
              <span className="text-sm text-white/90">For certified professionals</span>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Comprehensive Drug Information at Your Fingertips</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access detailed medication data, check interactions, and get AI-powered insights to improve patient care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Card className="border border-border/40 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Drug Encyclopedia</h3>
                <p className="text-muted-foreground">
                  Comprehensive database of medications with detailed information on dosing, interactions, and side effects.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/40 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Pill className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Interaction Checker</h3>
                <p className="text-muted-foreground">
                  Instantly check for potential drug interactions to ensure patient safety and medication efficacy.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/40 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">AI Assistant</h3>
                <p className="text-muted-foreground">
                  Get evidence-based answers to your drug-related questions from our advanced AI chatbot.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Designed for Healthcare Professionals</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform serves different roles in the healthcare industry with specialized features.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex gap-4">
              <Button
                variant={activeTab === 'physicians' ? 'default' : 'outline'}
                onClick={() => setActiveTab('physicians')}
                className="flex-1"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                For Physicians
              </Button>
              <Button
                variant={activeTab === 'researchers' ? 'default' : 'outline'}
                onClick={() => setActiveTab('researchers')}
                className="flex-1"
              >
                <Search className="mr-2 h-5 w-5" />
                For Researchers
              </Button>
            </div>
          </div>

          <div className={`grid md:grid-cols-2 gap-6 animate-fade-in ${activeTab === 'physicians' ? 'block' : 'hidden'}`}>
            <div className="space-y-6">
              <h3 className="text-2xl font-medium mb-4">Streamline Patient Care</h3>
              <ul className="space-y-4">
                {[
                  "Quickly verify drug safety during patient consultations",
                  "Access comprehensive medication information at the point of care",
                  "Get instant alerts for potential drug interactions",
                  "Improve prescription accuracy with evidence-based recommendations"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-6" size="lg" asChild>
                <Link to="/auth">Start Your Free Trial</Link>
              </Button>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg h-[300px] md:h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=60"
                alt="Physician using MedBot Pro" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <p className="text-white font-medium text-lg">
                    "MedBot Pro has significantly improved my medication decision-making process."
                  </p>
                  <p className="text-white/80 text-sm mt-2">Dr. Sarah Chen, Cardiologist</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`grid md:grid-cols-2 gap-6 animate-fade-in ${activeTab === 'researchers' ? 'block' : 'hidden'}`}>
            <div className="space-y-6">
              <h3 className="text-2xl font-medium mb-4">Advance Scientific Knowledge</h3>
              <ul className="space-y-4">
                {[
                  "Access comprehensive drug interaction data for research",
                  "Review historical medical literature through our AI assistant",
                  "Analyze medication trends and outcomes",
                  "Stay updated with the latest pharmaceutical developments"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-6" size="lg" asChild>
                <Link to="/auth">Start Your Free Trial</Link>
              </Button>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg h-[300px] md:h-[400px]">
              <img 
                src="images/for-researcher.jpg"
                alt="Researcher using MedBot Pro" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <p className="text-white font-medium text-lg">
                    "The depth of information available has been invaluable for our drug interaction studies."
                  </p>
                  <p className="text-white/80 text-sm mt-2">Dr. Michael Wong, Pharmaceutical Researcher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Medications */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Featured Medications</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore some of the most commonly researched medications in our database.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {[
              {
                name: "Aspirin",
                category: "NSAID",
                description: "Common pain reliever, fever reducer, and anti-inflammatory medication.",
                image: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/2244/PNG?record_type=2d&image_size=300x300"
              },
              {
                name: "Metformin",
                category: "Biguanide",
                description: "First-line medication for the treatment of type 2 diabetes.",
                image: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/4091/PNG?record_type=2d&image_size=300x300"
              },
              {
                name: "Atorvastatin",
                category: "Statin",
                description: "Medication that reduces levels of bad cholesterol (LDL) in the blood.",
                image: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/60823/PNG?record_type=2d&image_size=300x300"
              },
              {
                name: "Lisinopril",
                category: "ACE Inhibitor",
                description: "Medication that helps relax blood vessels to treat high blood pressure.",
                image: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5362119/PNG?record_type=2d&image_size=300x300"
              }
            ].map((drug, index) => (
              <Card 
                key={drug.name} 
                className="border border-border/40 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 duration-300"
                style={{animationDelay: `${0.2 + (index * 0.1)}s`}}
              >
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-32 h-32 mb-4 bg-white rounded-md p-2 shadow-sm">
                    <img 
                      src={drug.image}
                      alt={`Chemical structure of ${drug.name}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-medium mb-1">{drug.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{drug.category}</p>
                  <p className="text-sm line-clamp-2">{drug.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg">
              <Link to="/auth">
                <Search className="mr-2 h-5 w-5" />
                Explore All Medications
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">Join Our Professional Healthcare Community</h2>
            <p className="text-lg mb-8 text-muted-foreground">
              Get access to our comprehensive drug database, AI assistant, and interaction checker. Start improving your patient care today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auth">Sign Up Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/auth?action=login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold text-primary mb-2">MedBot</h2>
              <p className="text-sm text-muted-foreground">
                 
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <h3 className="font-medium mb-3">Platform</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="#features" className="hover:text-primary transition-colors">Features</Link></li>
                  <li><Link to="/auth" className="hover:text-primary transition-colors">Sign Up</Link></li>
                  <li><Link to="/auth?action=login" className="hover:text-primary transition-colors">Login</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Resources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Guidelines</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 MedBot Pro. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
