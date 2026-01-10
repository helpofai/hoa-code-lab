import { Shield, ExternalLink, Radio, Link2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface NetworkPanelProps {
    previewUrl: string | null;
}

export function NetworkPanel({ previewUrl }: NetworkPanelProps) {
    return (
        <div className="h-full flex flex-col bg-[#181818] text-[#cccccc] font-sans">
            <div className="p-4 border-b border-[#2b2b2b]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#858585] mb-4">Network & Domains</div>
                
                <div className="space-y-4">
                    <div className="p-4 bg-[#252526] rounded-xl border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Radio className={cn("w-3 h-3", previewUrl ? "text-green-500 animate-pulse" : "text-neutral-600")} />
                                <span className="text-xs font-bold text-white">Project Status</span>
                            </div>
                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded uppercase font-bold", previewUrl ? "bg-green-500/10 text-green-500" : "bg-neutral-800 text-neutral-500")}>
                                {previewUrl ? "Live" : "Offline"}
                            </span>
                        </div>
                        
                        {previewUrl ? (
                            <div className="space-y-3">
                                <div className="p-2 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between group">
                                    <span className="text-[11px] font-mono text-blue-400 truncate flex-1 mr-2">{previewUrl}</span>
                                    <a href={previewUrl} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors">
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-neutral-500">
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3 text-green-500" />
                                        SSL Enabled
                                    </div>
                                    <span>Port: 3000</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[11px] text-neutral-500 italic">Start your project to generate a public domain.</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="text-[10px] font-bold text-[#858585] uppercase px-1">Custom Domains</div>
                        <div className="p-4 bg-white/[0.02] border border-dashed border-white/10 rounded-xl text-center">
                            <Link2 className="w-6 h-6 text-neutral-700 mx-auto mb-2" />
                            <p className="text-[11px] text-neutral-500">Upgrade to Pro to connect custom subdomains.</p>
                            <button className="mt-3 text-[10px] font-bold text-[#007fd4] hover:underline">Learn More</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
