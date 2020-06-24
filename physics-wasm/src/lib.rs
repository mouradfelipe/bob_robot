mod utils;

use na::RealField;
use nalgebra as na;
use ncollide3d;
use ncollide3d::transformation::ToTriMesh;
use nphysics3d;
use nphysics3d::object::Body;
use nphysics3d::object::BodyPart;
use wasm_bindgen::prelude::*;
// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub enum Parts {
    BASE = 0,
    LEFT_WHEEL = 1,
    RIGHT_WHEEL = 2,
    WEIGHT = 3,
}

// allowing use of console.log for debugging purposes
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(a: &str);
}

#[wasm_bindgen(raw_module = "../../three.module.js")]
extern "C" {
    #[wasm_bindgen(js_namespace = THREE)]
    pub type Vector3;

    #[wasm_bindgen(constructor)]
    fn new(x: f64, y: f64, z: f64) -> Vector3;

    #[wasm_bindgen(js_namespace = THREE)]
    pub type Quaternion;

    #[wasm_bindgen(constructor)]
    fn new(x: f64, y: f64, z: f64, w: f64) -> Quaternion;
}

struct SegwayParts {
    segway_handle: nphysics3d::object::DefaultBodyHandle,
}

#[wasm_bindgen]
pub struct PhysicsWorld {
    mechanical_world: nphysics3d::world::DefaultMechanicalWorld<f64>,
    geometric_world: nphysics3d::world::DefaultGeometricalWorld<f64>,

    bodies: nphysics3d::object::DefaultBodySet<f64>,
    colliders: nphysics3d::object::DefaultColliderSet<f64>,
    joint_constraints: nphysics3d::joint::DefaultJointConstraintSet<f64>,
    force_generators: nphysics3d::force_generator::DefaultForceGeneratorSet<f64>,

    segway: SegwayParts,
    obstacles: Vec<nphysics3d::object::DefaultBodyHandle>,
}

#[wasm_bindgen]
impl PhysicsWorld {
    fn create_static_objects(
        bodies: &mut nphysics3d::object::DefaultBodySet<f64>,
        colliders: &mut nphysics3d::object::DefaultColliderSet<f64>,
    ) {
        //create arena
        let arena_body = nphysics3d::object::RigidBodyDesc::new()
            .status(nphysics3d::object::BodyStatus::Static)
            .build();

        let arena = bodies.insert(arena_body);
        let ground_shape = ncollide3d::shape::ShapeHandle::new(ncollide3d::shape::Plane::new(
            na::Vector3::y_axis(),
        ));
        let z_pos_wall_shape = ncollide3d::shape::ShapeHandle::new(ncollide3d::shape::Plane::new(
            -na::Vector3::z_axis(),
        ));
        let z_neg_wall_shape = ncollide3d::shape::ShapeHandle::new(ncollide3d::shape::Plane::new(
            na::Vector3::z_axis(),
        ));
        let x_pos_wall_shape = ncollide3d::shape::ShapeHandle::new(ncollide3d::shape::Plane::new(
            -na::Vector3::x_axis(),
        ));
        let x_neg_wall_shape = ncollide3d::shape::ShapeHandle::new(ncollide3d::shape::Plane::new(
            na::Vector3::x_axis(),
        ));

        let arena_collider = nphysics3d::object::ColliderDesc::new(
            ncollide3d::shape::ShapeHandle::new(ncollide3d::shape::Compound::new(vec![
                (na::Isometry3::new(na::zero(), na::zero()), ground_shape),
                (
                    na::Isometry3::new(na::Vector3::z() * 50.0, na::zero()),
                    z_pos_wall_shape,
                ),
                (
                    na::Isometry3::new(na::Vector3::z() * -50.0, na::zero()),
                    z_neg_wall_shape,
                ),
                (
                    na::Isometry3::new(na::Vector3::x() * 50.0, na::zero()),
                    x_pos_wall_shape,
                ),
                (
                    na::Isometry3::new(na::Vector3::x() * -50.0, na::zero()),
                    x_neg_wall_shape,
                ),
            ])),
        )
        .build(nphysics3d::object::BodyPartHandle(arena, 0));
        colliders.insert(arena_collider);

        let tree_shape1 = ncollide3d::shape::ShapeHandle::new(
            ncollide3d::shape::ConvexHull::try_from_points(
                &ncollide3d::shape::Cylinder::new(3.0, 0.1)
                    .to_trimesh(128)
                    .coords,
            )
            .unwrap(),
        );

        let tree_body1 = bodies.insert(nphysics3d::object::RigidBodyDesc::new()
            .status(nphysics3d::object::BodyStatus::Static)
            .translation(na::Vector3::new(-10.0, 0.0, 0.0))
            .build());

        let mut tree_material = nphysics3d::material::BasicMaterial::new(0.0, 0.0);
        tree_material.friction_combine_mode = nphysics3d::material::MaterialCombineMode::Multiply;
        let tree_material_handle1 = nphysics3d::material::MaterialHandle::new(tree_material);

        let tree_collider1 = nphysics3d::object::ColliderDesc::new(tree_shape1)
            .material(tree_material_handle1)
            .build(nphysics3d::object::BodyPartHandle(tree_body1, 0));

        colliders.insert(tree_collider1);

        let tree_shape2 = ncollide3d::shape::ShapeHandle::new(
            ncollide3d::shape::ConvexHull::try_from_points(
                &ncollide3d::shape::Cylinder::new(3.0, 0.1)
                    .to_trimesh(128)
                    .coords,
            )
            .unwrap(),
        );

        let tree_body2 = bodies.insert(nphysics3d::object::RigidBodyDesc::new()
            .status(nphysics3d::object::BodyStatus::Static)
            .translation(na::Vector3::new(0.0, 0.0, 15.0))
            .build());

        let tree_material_handle2 = nphysics3d::material::MaterialHandle::new(tree_material);

        let tree_collider2 = nphysics3d::object::ColliderDesc::new(tree_shape2)
            .material(tree_material_handle2)
            .build(nphysics3d::object::BodyPartHandle(tree_body2, 0));

        colliders.insert(tree_collider2);

        let tree3_top_shape = ncollide3d::shape::ShapeHandle::new(
            ncollide3d::shape::ConvexHull::try_from_points(
                &ncollide3d::shape::Cone::new(0.5, 0.3).to_trimesh(16).coords,
            )
            .unwrap(),
        );

        let tree3_bottom_shape = ncollide3d::shape::ShapeHandle::new(
            ncollide3d::shape::ConvexHull::try_from_points(
                &ncollide3d::shape::Cylinder::new(1.0, 0.25)
                    .to_trimesh(128)
                    .coords,
            )
            .unwrap(),
        );

        let tree_axis3 = na::Unit::new_normalize(na::Vector3::x());
        let rot = na::UnitQuaternion::from_axis_angle(&tree_axis3, 3.141592653589793238);

        let tree_shape3 =
            ncollide3d::shape::ShapeHandle::new(ncollide3d::shape::Compound::new(vec![
                (na::Isometry3::new(na::zero(), na::zero()), tree3_bottom_shape),
                (
                    na::Isometry3::from_parts(na::Translation3::new(0.0, 1.0, 0.0), rot),
                    tree3_top_shape,
                ),
            ]));
        let tree_body3 = bodies.insert(nphysics3d::object::RigidBodyDesc::new()
            .status(nphysics3d::object::BodyStatus::Static)
            .translation(na::Vector3::new(10.0, 0.0, 5.0))
            .build());

        let tree_material_handle3 = nphysics3d::material::MaterialHandle::new(tree_material);

        let tree_collider3 = nphysics3d::object::ColliderDesc::new(tree_shape3)
            .material(tree_material_handle3)
            .build(nphysics3d::object::BodyPartHandle(tree_body3, 0));

        colliders.insert(tree_collider3);

        //create ramp
        let ramp = nphysics3d::object::RigidBodyDesc::new()
            .status(nphysics3d::object::BodyStatus::Static)
            .translation(na::Vector3::z() * 4.0)
            .build();
        let ramp_handle = bodies.insert(ramp);
        let ramp_shape = ncollide3d::shape::ShapeHandle::new(
            ncollide3d::shape::ConvexHull::try_from_points(&[
                na::Point3::new(-4.0, 0.0, 0.0),
                na::Point3::new(4.0, 0.0, 0.0),
                na::Point3::new(-4.0, 2.0, 4.0),
                na::Point3::new(4.0, 2.0, 4.0),
                na::Point3::new(-4.0, 0.0, 4.0),
                na::Point3::new(4.0, 0.0, 4.0),
            ])
            .unwrap(),
        );
        let ramp_collider = nphysics3d::object::ColliderDesc::new(ramp_shape)
            .build(nphysics3d::object::BodyPartHandle(ramp_handle, 0));
        colliders.insert(ramp_collider);
    }

    fn create_robot(
        bodies: &mut nphysics3d::object::DefaultBodySet<f64>,
        colliders: &mut nphysics3d::object::DefaultColliderSet<f64>,
    ) -> nphysics3d::object::DefaultBodyHandle {
        // multibody needs to have a joint (connected to ground)
        let free_joint = nphysics3d::joint::FreeJoint::new(na::Isometry3::new(
            na::Vector3::y() * 4.0,
            na::zero(),
        ));
        let mut segway_desc = nphysics3d::object::MultibodyDesc::new(free_joint)
            //.parent_shift(na::Vector3::y()*0.9)
            .name("BodyBase".to_owned());
        //.body_shift(na::Vector3::y()*0.9);

        let mut left_axis = nphysics3d::joint::RevoluteJoint::new(na::Vector3::x_axis(), 0.0);
        left_axis.enable_angular_motor();
        left_axis.disable_max_angle();
        left_axis.disable_min_angle();
        let left_wheel_desc = segway_desc.add_child(left_axis);
        left_wheel_desc.set_name("LeftWheel".to_owned());
        left_wheel_desc.set_body_shift(na::Vector3::x() * (-0.6));
        left_wheel_desc.set_parent_shift(na::Vector3::y() * -0.6);

        let mut right_axis = nphysics3d::joint::RevoluteJoint::new(na::Vector3::x_axis(), 0.0);
        right_axis.enable_angular_motor();
        right_axis.disable_max_angle();
        right_axis.disable_min_angle();
        let right_wheel_desc = segway_desc.add_child(right_axis);
        right_wheel_desc.set_name("RightWheel".to_owned());
        right_wheel_desc.set_body_shift(na::Vector3::x() * (0.6));
        right_wheel_desc.set_parent_shift(na::Vector3::y() * -0.6);

        let weight_joint = nphysics3d::joint::FixedJoint::new(na::Isometry3::new(
            na::Vector3::y() * 0.8,
            na::zero(),
        ));
        let weight_desc = segway_desc.add_child(weight_joint);
        weight_desc.set_name("Weight".to_owned());

        let segway_handle = bodies.insert(segway_desc.build());
        let base = nphysics3d::object::BodyPartHandle(segway_handle, Parts::BASE as usize);
        let left_wheel =
            nphysics3d::object::BodyPartHandle(segway_handle, Parts::LEFT_WHEEL as usize);
        let right_wheel =
            nphysics3d::object::BodyPartHandle(segway_handle, Parts::RIGHT_WHEEL as usize);
        let weight = nphysics3d::object::BodyPartHandle(segway_handle, Parts::WEIGHT as usize);

        // removing sleep
        bodies
            .multibody_mut(segway_handle)
            .unwrap()
            .set_deactivation_threshold(None);

        let body_base_shape = ncollide3d::shape::ShapeHandle::new(
            ncollide3d::shape::ConvexHull::try_from_points(
                &ncollide3d::shape::Cone::new(0.6, 0.4).to_trimesh(16).coords,
            )
            .unwrap(),
        );
        let body_head_shape =
            ncollide3d::shape::ShapeHandle::new(ncollide3d::shape::Ball::new(0.5));

        let body_shape =
            ncollide3d::shape::ShapeHandle::new(ncollide3d::shape::Compound::new(vec![
                (na::Isometry3::new(na::zero(), na::zero()), body_base_shape),
                (
                    na::Isometry3::new(na::Vector3::y() * 0.6, na::zero()),
                    body_head_shape,
                ),
            ]));
        let body_collider = nphysics3d::object::ColliderDesc::new(body_shape)
            //.translation(na::Vector3::y()*0.6)
            .density(0.5)
            .build(base);
        colliders.insert(body_collider);
        //let body_handle_shape = ncollide3d::shape::ShapeHandle::new(ncollide3d::shape::Cuboid::new(na::Vector3::new(0.08, 1.18, 0.08)/2.0));
        //let body_handle_collider = nphysics3d::object::ColliderDesc::new(body_handle_shape)
        //    .density(1.0)
        //    //.translation(na::Vector3::new(0.0, 0.6, 0.2))
        //    .build(handle);
        //colliders.insert(body_handle_collider);
        let wheel_shape = ncollide3d::shape::ShapeHandle::new(
            ncollide3d::shape::ConvexHull::try_from_points(
                &ncollide3d::shape::Cylinder::new(0.09, 0.49)
                    .to_trimesh(128)
                    .coords,
            )
            .unwrap(),
        );
        let wheel_collider_desc = nphysics3d::object::ColliderDesc::new(wheel_shape)
            .density(5.0)
            .material(nphysics3d::material::MaterialHandle::new(
                nphysics3d::material::BasicMaterial::new(0.1, 5.0),
            ))
            .rotation(na::Vector3::z() * f64::frac_pi_2());

        let left_wheel_collider = wheel_collider_desc.build(left_wheel);
        colliders.insert(left_wheel_collider);

        let right_wheel_collider = wheel_collider_desc.build(right_wheel);
        colliders.insert(right_wheel_collider);

        let weight_shape = ncollide3d::shape::ShapeHandle::new(ncollide3d::shape::Ball::new(0.05));
        let weight_collider = nphysics3d::object::ColliderDesc::new(weight_shape)
            //.translation(na::Vector3::y()*0.6)
            .density(4e4)
            .build(weight);
        colliders.insert(weight_collider);

        return segway_handle;
    }

    fn create_dynamic_objects(
        bodies: &mut nphysics3d::object::DefaultBodySet<f64>,
        colliders: &mut nphysics3d::object::DefaultColliderSet<f64>,
        count: (usize, usize),
    ) -> Vec<nphysics3d::object::DefaultBodyHandle> {
        let separation = 2.0;
        let mut obstacles: Vec<nphysics3d::object::DefaultBodyHandle> = Vec::new();
        obstacles.reserve(count.0 * count.1);

        let mut obstacle_desc = nphysics3d::object::RigidBodyDesc::new()
            .status(nphysics3d::object::BodyStatus::Dynamic);
        let obstacle_shape = ncollide3d::shape::ShapeHandle::new(ncollide3d::shape::Cuboid::new(
            na::Vector3::new(1.0, 1.0, 1.0) / 2.0,
        ));
        let collider_desc = nphysics3d::object::ColliderDesc::new(obstacle_shape).density(1.0);

        for i in 0..count.0 {
            for k in 0..count.1 {
                obstacle_desc.set_translation(
                    na::Vector3::new(0.0, 4.0, -16.0)
                        + na::Vector3::new(
                            ((count.0 as f64) / 2.0 - (i as f64) - 0.5),
                            0.0,
                            ((count.0 as f64) / 2.0 - (k as f64) - 0.5),
                        ) * separation,
                );
                let obstacle = obstacle_desc.build();
                let obstacle_handle = bodies.insert(obstacle);
                colliders.insert(
                    collider_desc.build(nphysics3d::object::BodyPartHandle(obstacle_handle, 0)),
                );

                obstacles.push(obstacle_handle);
            }
        }
        return obstacles;
    }

    #[wasm_bindgen(constructor)]
    pub fn new() -> PhysicsWorld {
        let n_obstacles: (usize, usize) = (8, 4);
        utils::set_panic_hook();
        let mechanical_world =
            nphysics3d::world::MechanicalWorld::new(na::Vector3::new(0.0, -9.81, 0.0));
        let geometric_world = nphysics3d::world::GeometricalWorld::new();
        let mut bodies = nphysics3d::object::DefaultBodySet::new();
        let mut colliders = nphysics3d::object::DefaultColliderSet::new();
        let joint_constraints = nphysics3d::joint::DefaultJointConstraintSet::new();
        let force_generators = nphysics3d::force_generator::DefaultForceGeneratorSet::new();

        Self::create_static_objects(&mut bodies, &mut colliders);

        let segway_handle = Self::create_robot(&mut bodies, &mut colliders);

        let segway = SegwayParts { segway_handle };

        let obstacles = Self::create_dynamic_objects(&mut bodies, &mut colliders, n_obstacles);

        PhysicsWorld {
            mechanical_world,
            geometric_world,
            bodies,
            colliders,
            joint_constraints,
            force_generators,
            segway,
            obstacles,
        }
    }

    pub fn get_part_position(&self, part: Parts) -> Vector3 {
        let segway = self.bodies.multibody(self.segway.segway_handle).unwrap();
        let translation = segway
            .link(part as usize)
            .unwrap()
            .position()
            .translation
            .vector;

        Vector3::new(translation.x, translation.y, translation.z)
    }

    pub fn get_part_rotation(&self, part: Parts) -> Quaternion {
        let segway = self.bodies.multibody(self.segway.segway_handle).unwrap();
        let rotation = segway.link(part as usize).unwrap().position().rotation;

        Quaternion::new(
            rotation.vector().x,
            rotation.vector().y,
            rotation.vector().z,
            rotation.w,
        )
    }

    pub fn get_obstacle_position(&self, index: usize) -> Vector3 {
        let obstacle = self.bodies.rigid_body(self.obstacles[index]).unwrap();
        let translation = obstacle.position().translation.vector;

        Vector3::new(translation.x, translation.y, translation.z)
    }

    pub fn get_obstacle_rotation(&self, index: usize) -> Quaternion {
        let obstacle = self.bodies.rigid_body(self.obstacles[index]).unwrap();
        let rotation = obstacle.position().rotation;
        let vector = rotation.vector();

        Quaternion::new(vector.x, vector.y, vector.z, rotation.w)
    }

    pub fn step(&mut self) {
        self.mechanical_world.step(
            &mut self.geometric_world,
            &mut self.bodies,
            &mut self.colliders,
            &mut self.joint_constraints,
            &mut self.force_generators,
        );
    }

    pub fn set_timestep(&mut self, timestep: f64) {
        self.mechanical_world.set_timestep(timestep);
    }

    pub fn set_max_left_motor_torque(&mut self, torque: f64) {
        let segway = self
            .bodies
            .multibody_mut(self.segway.segway_handle)
            .unwrap();
        let left_axis = segway
            .link_mut(Parts::LEFT_WHEEL as usize)
            .unwrap()
            .joint_mut();
        match (left_axis).downcast_mut::<nphysics3d::joint::RevoluteJoint<f64>>() {
            Some(as_revolute) => {
                as_revolute.set_max_angular_motor_torque(torque);
            }
            None => {
                panic!("not a valid joint");
            }
        }
    }

    pub fn set_max_right_motor_torque(&mut self, torque: f64) {
        let segway = self
            .bodies
            .multibody_mut(self.segway.segway_handle)
            .unwrap();
        let right_axis = segway
            .link_mut(Parts::RIGHT_WHEEL as usize)
            .unwrap()
            .joint_mut();
        match (right_axis).downcast_mut::<nphysics3d::joint::RevoluteJoint<f64>>() {
            Some(as_revolute) => {
                as_revolute.set_max_angular_motor_torque(torque);
            }
            None => {
                panic!("not a valid joint");
            }
        }
    }

    pub fn set_left_motor_target_speed(&mut self, speed: f64) {
        let segway = self
            .bodies
            .multibody_mut(self.segway.segway_handle)
            .unwrap();
        let left_axis = segway
            .link_mut(Parts::LEFT_WHEEL as usize)
            .unwrap()
            .joint_mut();
        match (left_axis).downcast_mut::<nphysics3d::joint::RevoluteJoint<f64>>() {
            Some(as_revolute) => {
                as_revolute.set_desired_angular_motor_velocity(speed);
            }
            None => {
                panic!("not a valid joint");
            }
        }
    }

    pub fn set_right_motor_target_speed(&mut self, speed: f64) {
        let segway = self
            .bodies
            .multibody_mut(self.segway.segway_handle)
            .unwrap();
        let right_axis = segway
            .link_mut(Parts::RIGHT_WHEEL as usize)
            .unwrap()
            .joint_mut();
        match (right_axis).downcast_mut::<nphysics3d::joint::RevoluteJoint<f64>>() {
            Some(as_revolute) => {
                as_revolute.set_desired_angular_motor_velocity(speed);
            }
            None => {
                panic!("not a valid joint");
            }
        }
    }
}
