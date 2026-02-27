import Layout from "./components/Layout";

export default function Chat() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Chat</h1>

      <div className="bg-white p-6 rounded-xl shadow h-[500px] flex flex-col">

        <div className="flex-1 overflow-y-auto border rounded p-4 mb-4 bg-gray-100">
          <div className="bg-white p-2 rounded shadow mb-2 w-fit">
            Hola 👋
          </div>
        </div>

        <div className="flex gap-2">
          <input className="border p-2 flex-1 rounded" />
          <button className="bg-indigo-600 text-white px-4 rounded">
            Enviar
          </button>
        </div>

      </div>
    </Layout>
  );
}