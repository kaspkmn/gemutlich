export default function AiNotice() {
  return (
    <div className="notice stack tight">
      <b>Claude isn't connected yet</b>
      <p className="small">
        Writing feedback needs an Anthropic API key. Add <code>ANTHROPIC_API_KEY</code> to your Vercel environment variables and
        redeploy. The setup guide in the README walks through it.
      </p>
    </div>
  );
}
