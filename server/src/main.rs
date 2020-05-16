use rocket;
use rocket_contrib::serve;

fn main() {
    rocket::ignite().mount("/", serve::StaticFiles::from("./")).launch();
}
