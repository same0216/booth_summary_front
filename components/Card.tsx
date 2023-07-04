const fs = require("fs");

export async function Card() {
  try {
    const data = await fs.promises.readFile('../sample-app/public/booth-data.json', 'utf8');
    const json = JSON.parse(data);
    const result = json.map(el => (
      <div className="min-w-screen w-full flex mx-10 my-4 h-48 bg-white rounded-xl shadow-lg overflow-hidden transition hover:-translate-y-1 md:w-1/2">
        <div className="w-3/12 bg-black">
          <img src={el['img']} className="h-full w-full object-cover hover:object-contain"></img>
        </div>
        <div className="flex flex-col w-3/4">
          <div className="ml-2 mx-2 my-2">
            <a href="#" className="text-2xl font-semibold">
              {el['name']}
            </a>
          </div>
          <div className="mx-2 my-1">
            <span>累計いいね数:500</span>
          </div>
          <div className="mx-2 my-1">
            <span>今週いいね数:500</span>
          </div>
        </div>
      </div>
    ));
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}

