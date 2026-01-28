import { Button } from "@/components/ui/button";
import { ClientOnly, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  LoaderCircle,
  Lock,
  Share2,
  Users,
  Zap,
} from "lucide-react";
import EditorDemo from "./EditorDemo";

export default function Landing() {
  const navigate = useNavigate();
  const navigateToNote = () => {
    navigate({
      to: "/note",
    });
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              N
            </div>
            <span className="font-serif text-xl font-bold text-foreground">
              NoteSync
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#collaboration"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Collaboration
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size={"lg"}
              onClick={navigateToNote}
              className="bg-primary hover:bg-primary/90 text-primary-foreground "
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-primary">
                ✨ Real-time collaboration for teams
              </p>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight text-balance">
              Write, collaborate,
              <span className="block text-primary">create together</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto text-balance leading-relaxed">
              Build beautiful block-based notes with your team in real-time.
              Share with granular permissions and see changes as they happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                onClick={navigateToNote}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-base"
              >
                Start documenting your notes
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 md:mt-24 relative space-y-8">
            <h1 className="text-center text-5xl text-primary font-semibold font-mono">
              Checkout Editor Here
            </h1>

            <div className=" h-96 overflow-auto bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg">
              <ClientOnly
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <LoaderCircle className="animate-spin" />
                  </div>
                }
              >
                <EditorDemo />
              </ClientOnly>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-foreground/70">
              Powerful features designed to make collaboration seamless and
              intuitive
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Block-based Notes
              </h3>
              <p className="text-foreground/70">
                Create flexible, draggable blocks. Add text, lists, code,
                images, and more in any order.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Real-time Sync
              </h3>
              <p className="text-foreground/70">
                Changes broadcast instantly to all active sessions. See cursor
                positions and edits as they happen.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Smart Sharing
              </h3>
              <p className="text-foreground/70">
                Share with granular permissions. Grant view-only or editor
                access. Control who can see what.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Highlight */}
      <section id="collaboration" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                Collaboration made effortless
              </h2>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                Stop emailing documents back and forth. Real-time collaboration
                means your team stays in sync. See who&apos;s editing what,
                resolve comments instantly, and ship faster together.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-foreground">
                    Live cursor tracking and user presence
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-foreground">
                    Instant change propagation across devices
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-foreground">
                    Comment threads with @mentions and notifications
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-foreground">
                    Version history and restore deleted notes
                  </span>
                </li>
              </ul>
              <Button
                onClick={navigateToNote}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                Explore More Features
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-primary/5 rounded-2xl blur-3xl -z-10"></div>
              <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-border">
                  <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                  <div className="flex-1 h-4 bg-muted rounded-lg w-24"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded-lg w-full"></div>
                  <div className="h-4 bg-muted rounded-lg w-4/5"></div>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="h-16 bg-primary/10 rounded-lg border border-primary/20"></div>
                    <div className="h-16 bg-primary/10 rounded-lg border border-primary/20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to transform your workflows?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of teams already collaborating smarter. Start free,
            upgrade when you need to.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={navigateToNote}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-base"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  N
                </div>
                <span className="font-serif font-bold text-foreground">
                  NoteSync
                </span>
              </div>
              <p className="text-sm text-foreground/70">
                Real-time collaborative notes for teams.
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/60">
            <p>
              &copy; {new Date().getFullYear()} NoteSync. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://x.com/BodaNabeel"
                className="hover:text-foreground transition-colors"
              >
                Twitter
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://linkedin.com/in/nabeel-boda-0858b2234"
                className="hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/BodaNabeel/"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
